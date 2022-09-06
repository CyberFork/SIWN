import { ReactNode, useEffect, useState } from "react";
import maskStore from "../store/maskStore";
import { observer } from "mobx-react-lite";

const Mask = ({ children }: { children: ReactNode }) => {
  const [isMask, setIsMask] = useState(false);
  useEffect(() => {
    console.log("useEffect maskStore.isMask", maskStore.getIsMask());
    setIsMask(maskStore.getIsMask());
  }, [maskStore.getIsMask()]);
  return (
    <div>
      <div className="loading" style={{ display: isMask ? "block" : "none" }}>
        Loading&#8230;
      </div>
      {children}
    </div>
  );
};

export default observer(Mask);
