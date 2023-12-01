import { useEffect, useState } from "react";
import { IWallet } from "../../interface/WalletInterface";
import { Split__factory, TetherToken__factory } from "../../typechain-types";
import { Split } from '../../typechain-types/contracts/Split'
import { ethers } from "ethers";

type MySplitsPropType = {
    wallet: IWallet,
}

export default function MySplits({ wallet }: MySplitsPropType) {

    const [splitIds, setSplitIds] = useState<string[]>([]);
    const [splitData, setSplitData] = useState<Split.SplitGeneralDataStructOutput[]>([]);
    const [page, setPage] = useState<number>(0);

    const splitAddress: string = process.env.REACT_APP_SplitAddress as string;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const pageLength = 5;

    useEffect(() => {

        const getMySplits = async () => {
            const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
            const _splitIds = await split.getMySplits(page, page + pageLength);
            const ids: string[] = [];
            const _splitData: Split.SplitGeneralDataStructOutput[] = [];
            for (let i = 0; i < _splitIds.length; i++) {
                if (_splitIds[i] != "0x0000000000000000000000000000000000000000000000000000000000000000") {
                    _splitData.push(
                        await split.getSplitData(_splitIds[i])
                    );
                    ids.push(_splitIds[i]);
                }

            }
            setSplitIds(ids);
            setSplitData(_splitData);
        }

        getMySplits();
    }, [page]);


    const handleNextPage = async () => {
        const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
        const totalSplits = await split.getMyTotalSplits();

        if (page + pageLength <= totalSplits)
            setPage(page + pageLength);
        else
            alert("No more splits");
    }

    const handlePrevPage = () => {
        if (page - pageLength >= 0)
            setPage(page - pageLength);
    }

    return (
        <div>
            {
                splitIds.length > 0 &&
                splitIds.map((splitName, index) => {
                    const props = { splitData: splitData[index], wallet };
                    return <SplitData key={splitName} {...props}></SplitData>
                })
            }
            {
                splitIds.length == 0 &&
                <div>Oops!! No Splits created yet </div>
            }
            {
                splitIds.length > 0 &&
                <button onClick={handleNextPage}>Next</button>
            }
            {
                splitIds.length > 0 && page - pageLength >= 0 &&
                <button onClick={handlePrevPage}>Prev</button>
            }
        </div>
    )
}

type TypeSplitData = {
    splitData: Split.SplitGeneralDataStructOutput,
    wallet: IWallet
}
function SplitData({ splitData, wallet }: TypeSplitData) {

    const [showData, setShowData] = useState<boolean>(false);

    const handleShowData = () => {
        setShowData(!showData);
    }

    return (
        <div onClick={handleShowData}>
            <div> Creator: {splitData.creator} {ethers.getAddress(splitData.creator) === ethers.getAddress(wallet.address) && "(You)"} </div>
            <div> Description: {splitData.splitDescription}</div>
            <div> Split Amount: {splitData.totalSplitAmount.toString()}</div>
            <div>Lock Time: {(new Date(splitData.lockTime.toString())).toLocaleDateString()}</div>
            {
                ethers.getAddress(splitData.creator) === ethers.getAddress(wallet.address) && showData &&
                <CreatorData borrowers={splitData.borrowers} splitName={splitData.splitName} wallet={wallet} ></CreatorData>
            }
            {
                ethers.getAddress(splitData.creator) !== ethers.getAddress(wallet.address) && showData &&
                <BorrowerData splitName={splitData.splitName} wallet={wallet}></BorrowerData>
            }
        </div>
    )
}

type TypeBorrowerData = {
    splitName: string,
    wallet: IWallet
}
function BorrowerData({ splitName, wallet }: TypeBorrowerData) {

    const [borrowerData, setBorrowerData] = useState<Split.SplitBorrowerDataStructOutput>();

    const splitAddress: string = process.env.REACT_APP_SplitAddress as string;
    const tokenAddress: string = process.env.REACT_APP_TokenAddress as string;
    const provider = new ethers.BrowserProvider(window.ethereum);

    useEffect(() => {

        const getBorrowerData = async () => {
            const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
            const data = await split.getSplitBorrowerData(splitName);
            setBorrowerData(data);
        }
        getBorrowerData();

    }, []);

    const handleApproveAgreement = async (e: any) => {
        e.stopPropagation();
        const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
        const token = TetherToken__factory.connect(tokenAddress, await provider.getSigner(wallet.address));
        try {
            const tx = await token.approve(splitAddress, borrowerData?.collateral as bigint);
            await tx.wait();
        }
        catch (error: any) {
            const revertData = error?.data;
            const decodedError = token.interface.parseError(revertData);
            console.error(`Transaction failed: ${decodedError?.name}`);
        }

        try {
            const tx = await split.approveAgreement(splitName);
            await tx.wait();
            alert("Agreement Approved");
        }
        catch (error: any) {
            const revertData = error?.data;
            const decodedError = split.interface.parseError(revertData);
            console.error(`Transaction failed: ${decodedError?.name}`);
        }


    }

    const handleApprovePayment = async (e: any) => {
        e.stopPropagation();
        const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
        const token = TetherToken__factory.connect(tokenAddress, await provider.getSigner(wallet.address));
        try {
            const tx = await token.approve(splitAddress, borrowerData?.owedAmount as bigint);
            await tx.wait();
        }
        catch (error: any) {
            const revertData = error?.data;
            const decodedError = token.interface.parseError(revertData);
            console.error(`Transaction failed: ${decodedError?.name}`);
        }

        try {
            const tx = await split.approvePayment(splitName);
            await tx.wait();
            alert("Payment Successful");
        }
        catch (error: any) {
            const revertData = error?.data;
            const decodedError = split.interface.parseError(revertData);
            console.error(`Transaction failed: ${decodedError?.name}`);
        }

    }

    const handleWithdrawCollateral = async (e: any) => {
        e.stopPropagation();
        const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
        try {
            const tx = await split.withdrawCollateral(splitName);
            await tx.wait();
            alert("Collateral Withdrawed");
        }
        catch (error: any) {
            const revertData = error?.data;
            const decodedError = split.interface.parseError(revertData);
            console.error(`Transaction failed: ${decodedError?.name}`);
        }
    }


    return (
        <>
            <div> Owed Amount: {borrowerData?.owedAmount.toString()}</div>
            <div>Collateral: {borrowerData?.collateral.toString()}</div>
            <button onClick={(e)=>handleApproveAgreement(e)} disabled={borrowerData?.agreementApproved}>Approve Agreement</button>
            <button onClick={(e)=>handleApprovePayment(e)} disabled={borrowerData?.paidStatus}>Approve Payment</button>
            <button onClick={(e)=>handleWithdrawCollateral(e)} disabled={borrowerData?.collateralWithdrawed}>Withdraw Collateral</button>
        </>
    )
}

type TypeCreatorData = {
    borrowers: Split.BorrowerStructOutput[],
    splitName: string,
    wallet: IWallet
}


function CreatorData({ borrowers, splitName, wallet }: TypeCreatorData) {
    
    // const initialShow: { [k: string]: boolean } = {};
    // borrowers.map((borrower) => {
    //     initialShow[borrower.borrower as string] = false;
    // })
    // const [showBorrowerData, setShowBorrowerData] = useState<{ [k: string]: boolean }>(initialShow);
    const defaultAddress = "0";
    const [currentBorrowerAddress, setCurrentBorrowerAddress] = useState<string>(defaultAddress);
    const [currentBorrower, setCurrentBorrower] = useState<Split.SplitBorrowerDataStructOutput>();

    const splitAddress: string = process.env.REACT_APP_SplitAddress as string;
    const tokenAddress: string = process.env.REACT_APP_TokenAddress as string;
    const provider = new ethers.BrowserProvider(window.ethereum);

    useEffect(() => {
        const getBorrowerShown = async () => {
            const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
            try {
                const data = await split.getSplitBorrowerDataForCreator(splitName, currentBorrowerAddress);
                setCurrentBorrower(data);
            }
            catch (error: any) {
                const revertData = error?.data;
                const decodedError = split.interface.parseError(revertData);
                console.error(`Transaction failed: ${decodedError?.name}`);
            }
        }
        
        if (currentBorrowerAddress != defaultAddress)
            getBorrowerShown();
    }, [currentBorrowerAddress])


    const handleShowBorrowerData = async (borrower: string, e:any) => {
        // setShowBorrowerData({ ...showBorrowerData, [borrower]: !showBorrowerData[borrower] })
        e.stopPropagation();
        if (ethers.getAddress(borrower) !== currentBorrowerAddress)
            setCurrentBorrowerAddress(ethers.getAddress(borrower));
        else setCurrentBorrowerAddress("0");
    }

    const levyPenalty = async (borrower: string, collateral: bigint, e: any) => {
        e.stopPropagation();
        const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
        const token = TetherToken__factory.connect(tokenAddress, await provider.getSigner(wallet.address));
        try {
            const tx = await split.levyPenalty(splitName, borrower);
            await tx.wait();
            alert(`Penalty Levied, collateral of ${ethers.parseUnits(collateral.toString(), 'wei')} deposited in your account`);
            console.log(await token.balanceOf(wallet.address));
        }
        catch (error: any) {
            const revertData = error?.data;
            const decodedError = split.interface.parseError(revertData);
            console.error(`Transaction failed: ${decodedError?.name}`);
        }
    }

    return (
        <>
            {
                borrowers.map((borrower) => {
                    return (
                        <div key={borrower.borrower} onClick={(e) => handleShowBorrowerData(borrower.borrower, e)}>
                            {borrower.borrower}
                            {
                                ethers.getAddress(borrower.borrower) === currentBorrowerAddress &&
                                <div>
                                    <div>Owed Amount: {borrower.owedAmount.toString()}</div>
                                    <div>Collateral: {borrower.collateral.toString()}</div>
                                    <div> Agreement Approved: {currentBorrower?.agreementApproved == true ? "Yes" : "NO"}</div>
                                    <div> Payment Made: {currentBorrower?.paidStatus == true ? "Yes" : "NO"}</div>
                                    <button onClick={(e) => levyPenalty(borrower.borrower, borrower.collateral, e)} disabled={currentBorrower?.penalyLevied}> Levy Penalty</button>
                                </div>

                            }
                        </div>
                    )
                })
            }
        </>
    )
}