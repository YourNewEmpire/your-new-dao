import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { ICMSDao } from "../../interfaces/cmscontract";
const cmsURL = process.env.GRAPH_CMS;
const client = new GraphQLClient(cmsURL ? cmsURL : "");

const Project = ({ dao }: { dao: ICMSDao }) => {
  return (
    <div className="">
      <h1>
            {dao.addressSlug}
      </h1>
    </div>
  );
};

export default Project;

//* Secondly, get info about each path.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  //@ts-ignore
  const slug = params.slug as string;
  const query = gql`
    query Dao($slug: String!) {
      dao(where: { addressSlug: $slug }) {
        addressSlug
        addressUrl
      }
    }
  `;

  //* fetch content from graphcms.
  const data: { dao: ICMSDao | null } = await client.request(query, {
    slug,
  });

  if (!data.dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao: data.dao },
    revalidate: 60 * 60,
  };
};

//* Firstly, make a path for each project
export const getStaticPaths: GetStaticPaths = async () => {
  const query = gql`
    query Daos {
      daos {
        addressSlug
      }
    }
  `;

  const data = await client.request(query);

  return {
    paths: data.daos.map((dao: ICMSDao) => ({
      params: { slug: dao.addressSlug },
    })),
    fallback: "blocking",
  };
};
