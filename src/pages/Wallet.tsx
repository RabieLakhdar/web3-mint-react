import * as React from 'react';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { ethers } from "ethers";
import type { NFTMinter } from '../typechain-types/contracts/NFTMinter';

const Wallet = () => {

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  interface Props {
    window?: () => Window;
    children?: React.ReactElement;
  }
  interface IWallet {
    iconColor: string;
    connectedWallet: string;
    contractAddress: string;
    contractSymbol: string;
    contractBaseTokenURI: string;
    contractOwnerAddress: string;
    contractPrice: string;
    isOwner: boolean;
  }

  interface IService {
    account: string;
    ethProvider?: ethers.providers.Web3Provider,
    contract?: NFTMinter;
    currentBalance: number;
    ethBalance: string;
    mintAmount: number;
  }

  const [state, setState] = React.useState<IWallet>({
    iconColor: "disabled",
    connectedWallet: "",
    contractSymbol: "",
    contractAddress: "",
    contractBaseTokenURI: "",
    contractOwnerAddress: "",
    contractPrice: "",
    isOwner: false
  });

  const [service, setService] = React.useState<IService>({
    account: "",
    currentBalance: 0,
    ethBalance: "",
    mintAmount: 0
  })
  const connectWallet = async () => {
    try {
      console.log("connect wallet");
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = NFTMinter__factory.connect(contractAddress, provider.getSigner());
      //const contract = new ethers.Contract(contractAddress, NFTCollectible__factory.abi, signer) as NFTCollectible;
      const ownerAddress = await contract.owner();
      const symbol = await contract.symbol();
      const baseTokenURI = await contract.baseTokenURI();
      const balance = await (await contract.balanceOf(accounts[0])).toNumber();
      const ethBalance = ethers.utils.formatEther(await provider.getBalance(accounts[0]));
      const isOwner = (ownerAddress.toLowerCase() === accounts[0].toLowerCase());
      const price = ethers.utils.formatEther(await contract.PRICE());
      setState({
        iconColor: "success",
        connectedWallet: accounts[0],
        contractSymbol: symbol,
        contractAddress: contract.address,
        contractBaseTokenURI: baseTokenURI,
        contractOwnerAddress: ownerAddress,
        contractPrice: `${price} ETH`,
        isOwner: isOwner
      });

      setService({
        account: accounts[0],
        contract: contract,
        currentBalance: balance,
        ethBalance: `${ethBalance} ETH`,
        mintAmount: 0,
        ethProvider: provider
      });

      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      {!service.account && <Button onClick={connectWallet}>Connect wallet</Button>}
      <div style={{ margin: "60px", display: "grid", height: "300px" }}>

        <Box sx={{ display: 'display', alignItems: 'center' }}>
          <TextField id="wallet_address" label="Connected Account"
            sx={{ width: 600 }}
            value={state.connectedWallet}
            inputProps={{ readOnly: true, }}
          />
        </Box>
        <TextField id="contract_symbol" label="Contract Symbol"
          value={state.contractSymbol}
          inputProps={{ readOnly: true, }}
        />
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField id="contract_address" label="Contract Address"
            sx={{ width: 600 }}
            value={state.contractAddress}
            inputProps={{ readOnly: true, }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField id="contract_baseURI" label="Contract Base Token URI"
            sx={{ width: 600 }}
            value={state.contractBaseTokenURI}
            inputProps={{ readOnly: true, }}
          />
        </Box>
      </div>
    </React.Fragment>
  );
}

export default Wallet;
