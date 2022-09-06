import { useEffect } from "react";
import EvmChainButton from "./EvmChainButton";
import NftSelection from "./NftSelection";

export default function ChainList(props: any) {
  const {target} = props
  const clickHandle = (chainId: number) => {
    props.clickHandler(chainId);
  };
  return (

        <EvmChainButton chainId={1} clickHandler={clickHandle} />

  );
}
