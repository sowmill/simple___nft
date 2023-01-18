import React, { useState } from "react";
import { NFTStorage, File } from 'nft.storage'
import networkMapping from "../chain-info/deployments/map.json"
import { ethers } from "ethers"
import { Send_collect } from "../Hooks/Send_collect";


export const Main = () => {
  const { Collect } = Send_collect()

  const [baseImage, setBaseImage] = useState("");
  const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYwOERFZTg0RTUyMEJCNjY5NjY4MTRkM0Y3RjI2MERDNTc1NjM2ODUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3Mzk3NDM1NzIxNiwibmFtZSI6InNpbXBsZV9uZnQifQ.IKRkEl_r_iDNjjM1EL-MU2ZyY4UQ-DKwF4VBGrq_p2k'
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);

  };

  function b64toBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
        console.log(fileReader.result)
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const HandleChangeipfs = async () => {
    let blob = b64toBlob(baseImage)
    const imageFile = new File([blob], 'image_name.jpeg')
    const metadata = await nftstorage.store({
      name: 'your sweet NFT',
      description: 'Just try to funge it. You can\'t do it.',
      image: imageFile
    })
    console.log('IPFS URL for the metadata:', metadata.url)
    console.log('metadata.json contents:\n', metadata.data)
    console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
    return metadata.url
  }

  const HandleChange = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const Collectible_deployed_address = networkMapping["5"]["SimpleCollectible"][0]
    const signer = provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    const myAddress = await signer.getAddress();
    const contract = new ethers.Contract(Collectible_deployed_address, [
      "function createCollectible (string memory tokenURI) public returns (uint256)"
    ], signer)
    console.log(myAddress)
    let tx = await contract.createCollectible(HandleChangeipfs())
    // console.log(Collect(HandleChangeipfs()))
    const contract2 = new ethers.Contract(Collectible_deployed_address, [
      "function viewtokenid() public view returns (uint256)"
    ], signer)

    let tx2 = await contract2.viewtokenid().toString()
    console.log(tx2)


  }




  return (
    <div className="App">
      <input
        type="file"
        onChange={(e) => {
          uploadImage(e);
        }}
      /><br></br>
      <br></br>
      <img src={baseImage} height="200px" />
      <br></br>
      <br></br>
      <br></br>
      <button onClick={HandleChangeipfs}>Upload to ipfs</button>
      <br></br>
      <br></br>
      <button onClick={HandleChange}>Mint NFT</button>
      <br></br>
      <h5>Copy this link in Browser after Minting</h5>
      <h4>https://testnets.opensea.io/assets/goerli/{networkMapping["5"]["SimpleCollectible"][0]}/0</h4>

      <h3>Quick how to:</h3>
      <ol>1. Install MetaMask Browser Extension and turn on "Show test networks" in advanced settings.</ol>
      <ol>2. Make sure that the Ethereum Account has some testnet Goerli Ethereum which you can get <a href="https://goerlifaucet.com/" target={"_blank"} rel="noreferrer noopener">here.</a></ol >
      <ol>3. Choose image to upload.</ol>
      <ol>4. Upload to ipfs and check confirmations in console. This will take couple of minutes.</ol>
      <ol>5. Mint your NFT and wait. This will also take a few minutes.</ol>
      <ol>6. Shuffle through tokenids in opensea link. (last digit in the link)</ol>

    </div>
  );
}