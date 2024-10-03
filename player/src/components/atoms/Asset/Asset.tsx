import { Asset as AssetType } from 'drystone';
import ImageAsset from "../ImageAsset/ImageAsset.tsx";

interface AssetProps {
  asset: AssetType
}

function Asset({ asset }: AssetProps){

  function render(){
    switch (asset.type) {
      case 'png':
        return <ImageAsset asset={asset} />
    }
  }

  return (
    <>{ render() }</>
  )
}

export default Asset;
