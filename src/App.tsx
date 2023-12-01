import './App.css';
import { BrowserProvider, ethers } from 'ethers'
import { useEffect, useState } from 'react';
import { IWallet } from "./interface/WalletInterface"
import CreateSplit from './pages/CreateSplit/CreateSplit';
import MySplits from './pages/MySplits/MySplits';



function App() {

  const initialWallet: IWallet = { address: "", chainId: 0n };
  const [wallet, setWallet] = useState(initialWallet);

  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");

  const [showCreateSplit, setShowCreateSplit] = useState<boolean>(false);
  const [showMySplits, setShowMySplits] = useState<boolean>(false);

  useEffect(() => {

    const getProvider = async () => {
      let provider: any;
      if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts');
        updateWallet(accounts);
        window.ethereum.on('accountsChanged', updateWallet);
        window.ethereum.on('chainChanged', updateChain);
      }
      else
        console.error("Please install a wallet");
    }

    getProvider();

    return () => {
      window.ethereum?.removeListener('accountsChanged', updateWallet);
      window.ethereum?.removeListener("chainChanged", updateChain);
    }

  }, []);

  const updateWallet = async (accounts: any[]) => {
    if (accounts.length === 0)
      setWallet(initialWallet);
    else {
      const provider = await new BrowserProvider(window.ethereum);
      const chainId = (await provider.getNetwork())?.chainId;
      setWallet({ chainId, address: accounts[0] });
    }
  }

  const updateChain = (chainId: any) => {
    window.location.reload();
    // setWallet({ ...wallet, chainId });
  }

  const connectWalletHandler = async () => {
    setIsConnecting(true);
    // window.ethereum.request({
    //   method: 'eth_requestAccounts'
    // })
    //   .then((accounts: []) => {
    //     updateWallet(accounts);
    //   })
    //   .catch((error: any) => {
    //     setError(true);
    //     setErrorMessage(error.message);
    //   })
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        updateWallet([signer.address]);
        window.ethereum.on('accountsChanged', updateWallet);
        window.ethereum.on('chainChanged', updateChain);
      }
      catch (error: any) {
        setError(true);
        setErrorMessage(error?.message);
        console.error(error);
      }
    }
    else
      console.error("Please install a wallet");


    setIsConnecting(false);
  }

  const handleShowCreateSplit = () => {
    setShowCreateSplit(!showCreateSplit);
  }

  const handleShowMySplits = () => {
    setShowMySplits(!showMySplits);
  }

  const disableConnect = !(Boolean(wallet)) && isConnecting;

  return (
    <div className="App">
      {window.ethereum?.isMetaMask && !wallet.address &&
        <button disabled={disableConnect} onClick={connectWalletHandler}>Connect MetaMask</button>
      }
      {wallet.address &&
        <>
          <div>Wallet Accounts: {wallet.address}</div>
          <div>ChainId: {wallet.chainId.toString()}</div>
          <button onClick={handleShowCreateSplit}>New Split</button>
          <button onClick={handleShowMySplits}>My Splits</button>
          {
            showCreateSplit &&
            <CreateSplit wallet={wallet} handleShowCreateSplit={handleShowCreateSplit}></CreateSplit>
          }
          {
            showMySplits &&
            <MySplits wallet={wallet}></MySplits>
          }
        </>
      }
      {
        error && (
          <div onClick={() => setError(false)}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )
      }

    </div>
  );
}

export default App;
