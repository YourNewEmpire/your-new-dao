import React from 'react'
import Link from 'next/link'
import { ICMSDao } from '../../interfaces/cmscontract'

const ContractCard = ({
    cmsDao,
    contractSaleData,
}: {
    cmsDao: ICMSDao;
    contractSaleData: boolean;
}) => {
    return (

        <div className="rounded-lg ring-4 ring-cyan-600">
            <div className="m-4 lg:space-y-2 xl:space-y-4 text-lg  text-center">
                <h1 className=" overflow-hidden overflow-ellipsis">
                    {cmsDao.addressSlug}
                </h1>

                <h1
                    className={`
  
                  ${contractSaleData
                            ? " text-orange-500"
                            : "text-teal-500"
                        }`}
                >
                    {" "}
                    {contractSaleData
                        ? "Contract Sold"
                        : "Contract Available"}
                </h1>
            </div>

            <div className="rounded-lg flex flex-row items-end justify-center text-center text-base break-all">
                <a
                    rel="noopener noreferrer"
                    target="blank"
                    href={cmsDao.addressUrl}
                    className="overflow-hidden overflow-ellipsis whitespace-nowrap p-2 xl:p-4 w-1/2 flex flex-row justify-center items-center rounded-tr-md rounded-bl-md transition duration-300 ease-in-out hover:bg-cyan-800"
                >
                    View On PolygonScan
                </a>
                <Link href={`/marketplace/${cmsDao.addressSlug}`}>
                    <a className=" p-2 xl:p-4 w-1/2 flex flex-row justify-center items-center rounded-tl-md rounded-br-md transition duration-300 ease-in-out hover:bg-cyan-800">
                        View Here
                    </a>
                </Link>
            </div>
        </div>
    )
}


export default ContractCard
