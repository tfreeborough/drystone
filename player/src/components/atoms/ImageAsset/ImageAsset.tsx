import { Asset } from 'drystone';
import {useEffect, useState} from "react";


interface ImageAssetProps {
  asset: Asset
}

function ImageAsset({ asset }: ImageAssetProps){
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if(asset.data){
      const url = URL.createObjectURL(asset.data);
      setUrl(url);
    }
    return () => {
      if(url){
        URL.revokeObjectURL(url);
      }
    }
  }, [asset]);

  if(!url){ return null }
  return (
    <img alt={asset.id} src={url} />
  )
}

export default ImageAsset;
