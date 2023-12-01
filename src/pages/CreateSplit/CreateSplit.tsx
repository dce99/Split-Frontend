import { useState } from "react"
import { IWallet } from "../../interface/WalletInterface"
import { ethers } from "ethers"
import { IBorrower } from "../../interface/BorrowerInterface"
import SplitAbi from '../../contract/Split'
import { Split__factory } from "../../typechain-types"


type CreateSplitPropType = {
    wallet: IWallet,
    handleShowCreateSplit: () => void
}
function CreateSplit({ wallet, handleShowCreateSplit }: CreateSplitPropType) {

    const [amount, setAmount] = useState<number>(0);
    const [lockTime, setLockTime] = useState<number>(Date.now());
    const [description, setDescription] = useState<string>('');
    const [borrowers, setBorrowers] = useState<IBorrower[]>([{ owedAmount: 0n, collateral: 0n, address: "" }]);
    const [splitCreated, setSplitCreated] = useState<boolean>(false);
    const splitAddress: string = process.env.REACT_APP_SplitAddress as string;
    const tokenAddress: string = process.env.REACT_APP_TokenAddress as string;

    const handleDescription = (e: any) => {
        setDescription(e.target.value);
    }

    const handleAmount = (e: any) => {
        setAmount(e.target.value);
    }

    const handleLockTime = (e: any) => {
        setLockTime(e.target.value);
    }

    const handleAddress = (id: number, e: any) => {
        const newBorrowers: IBorrower[] = borrowers.map((obj: IBorrower, index: number) => {
            if (index == id) {
                return {
                    address: e?.target?.value,
                    owedAmount: obj.owedAmount,
                    collateral: obj.collateral
                };
            }
            else return obj;
        });

        setBorrowers(newBorrowers);
    }

    const handleOwedAmount = (id: number, e: any) => {
        const newBorrowers: IBorrower[] = borrowers.map((obj: IBorrower, index: number) => {
            if (index == id) {
                return {
                    address: obj.address,
                    owedAmount: e?.target?.value,
                    collateral: obj.collateral
                };
            }
            else return obj;
        });

        setBorrowers(newBorrowers);
    }

    const handleCollateral = (id: number, e: any) => {
        const newBorrowers: IBorrower[] = borrowers.map((obj: IBorrower, index: number) => {
            if (index == id) {
                return {
                    address: obj.address,
                    owedAmount: obj.owedAmount,
                    collateral: e?.target?.value,
                };
            }
            else return obj;
        });

        setBorrowers(newBorrowers);
    }

    const createSplit = async (e: any) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // const split = new ethers.Contract(splitAddress, SplitAbi, await provider.getSigner(wallet.address));
        const split = Split__factory.connect(splitAddress, await provider.getSigner(wallet.address));
        const data = {
            baseTokenAddress: await ethers.getAddress(tokenAddress),
            totalSplitAmount: ethers.parseEther(`${amount}`),
            lockTime,
            description,
            borrowers: borrowers.map((obj) => {
                return { borrower: obj.address, owedAmount: ethers.parseEther(`${obj.owedAmount}`), collateral: ethers.parseEther(`${obj.collateral}`) }
            })
        }
        try {
            const tx = await split.createSplit(data.baseTokenAddress, data.totalSplitAmount, data.lockTime, data.description, data.borrowers)
            const receipt = await tx.wait();
            // const handleSplitCreated = (creator: string, splitName: string, splitDescription: string) => {
            //     console.log("Event data: ", creator, splitName, splitDescription, " :dwedw");
            //     console.log(creator.length, splitName.length, splitDescription.length);
            //     // split.interface.parseLog()    
            // };
            // console.log(receipt?.logs);
            // const event = split.filters["SplitCreated(address,bytes32,string)"]
            // await split.on(event, handleSplitCreated);
            setSplitCreated(true);
            handleShowCreateSplit();

            // @TODO Add a popopu which shows splitName, splitDescription and then redirect logic , to redirect to my splits page
        }
        catch (error: any) {
            const revertData = error?.data;
            const decodedError = split.interface.parseError(revertData);
            console.error(`Transaction failed: ${decodedError?.name}`);
        }
    }

    const addBorrower = (e: any) => {
        setBorrowers([...borrowers, { owedAmount: 0n, collateral: 0n, address: "" }]);
    }

    const infoProps = { amount, lockTime, description, handleAmount, handleDescription, handleLockTime };

    return (
        <div>
            <SplitInfo {...infoProps}></SplitInfo>
            <div>
                {borrowers.map((obj, index) => {
                    const props = { ...obj, handleAddress, handleOwedAmount, handleCollateral, id: index };
                    return <Borrower key={index} {...props} ></Borrower>
                })}
            </div>

            {
                !splitCreated &&
                <button onClick={addBorrower}> Add Borrower</button>
            }
            {
                !splitCreated &&
                <button onClick={createSplit}>Create Split</button>
            }
        </div>
    )
}

type SplitInfoPropType = {
    amount: number,
    lockTime: number,
    description: string,
    handleAmount: (e: any) => void,
    handleDescription: (e: any) => void,
    handleLockTime: (e: any) => void,
}

function SplitInfo({ amount, lockTime, description, handleAmount, handleDescription, handleLockTime }: SplitInfoPropType) {
    return (
        <div>
            Description
            <input value={description} onChange={handleDescription} />
            Amount
            <input value={amount} onChange={handleAmount} />
            Lock Time
            <input value={lockTime} onChange={handleLockTime} />
        </div>
    )
}


function Borrower({ address, owedAmount, collateral, id, handleAddress, handleOwedAmount, handleCollateral }: any) {

    return (
        <div>
            Address
            <input value={address} onChange={(e) => handleAddress(id, e)} />
            Owed Amount
            <input value={owedAmount} onChange={(e) => handleOwedAmount(id, e)} />
            Collateral
            <input value={collateral} onChange={(e) => handleCollateral(id, e)} />
        </div>
    )
}



export default CreateSplit;