
import networkMapping from "../chain-info/deployments/map.json"
import { useContractFunction } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"
import { utils } from "ethers"
import { InfuraProvider } from "@ethersproject/providers"
import collectibleabi from "../chain-info/contracts/SimpleCollectible.json"


export const Send_collect = () => {
  const network = "goerli"
  var provider = new InfuraProvider(network, "d03bf5fd19d9483b8600a4a220402a71")
  const { abi } = collectibleabi
  const collectible_deployed_address = networkMapping["5"]["SimpleCollectible"][0]
  const collectibleinterface = new utils.Interface(abi)
  const collectiblecontract = new Contract(collectible_deployed_address, collectibleinterface, provider)

  const { send: send_collec, state: send_collec_state } =
    useContractFunction(collectiblecontract, "createCollectible",
      { transactionName: "approved_collec" })
  const Collect = async (newinput: String) => {
    return await send_collec(newinput)

  }
  return { Collect }
}