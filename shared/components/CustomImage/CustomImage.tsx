import css from "./CustomImage.module.scss";

interface CustomImageProps {
  data: string;
}

export const CustomImage = ({ data }: CustomImageProps) => {
  return (
    <div className={css.customImage}>
      <img tabIndex={0} src={data} className={css.image} />
    </div>
  );
};
