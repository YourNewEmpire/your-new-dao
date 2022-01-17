import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { GraphQLClient, gql } from "graphql-request";
import ethers from "ethers";
import { ICMSDao } from "../../interfaces/cmscontract";
const cmsURL = process.env.GRAPH_CMS;
const client = new GraphQLClient(cmsURL ? cmsURL : "");

const Project = ({ dao }: { dao: ICMSDao }) => {
//todo - use moralis to get metamask user address and call tx with ethers passing in user address
  //todo - Refactor this for when new chains are added

  return (
    <div className="">
      <h1>{dao.addressSlug}</h1>
    </div>
  );
};

export default Project;

//* Secondly, get info about each path.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  //@ts-ignore
  const slug = params.slug as string;
  console.log(slug);
  const query = gql`
    query Dao($slug: String!) {
      daoContract(where: { addressSlug: $slug }) {
        addressSlug
        addressUrl
        chain
      }
    }
  `;

  //* fetch content from graphcms.
  //todo - fix typing here. check the interfaces
  const data: any = await client.request(query, {
    slug,
  });
  console.log(data);
  if (!data.daoContract) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao: data.daoContract },
    revalidate: 60 * 60,
  };
};

//* Firstly, make a path for each project
export const getStaticPaths: GetStaticPaths = async () => {
  const query = gql`
    query Daos {
      daoContracts {
        addressSlug
      }
    }
  `;

  const data = await client.request(query);
  return {
    paths: data.daoContracts.map((dao: ICMSDao) => ({
      params: { slug: dao.addressSlug },
    })),
    fallback: "blocking",
  };
};
