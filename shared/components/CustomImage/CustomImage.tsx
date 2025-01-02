import css from "./CustomImage.module.scss";

export const CustomImage = ({ data }: any) => {
  return (
    <div className={css.customImage}>
      <img tabIndex={0} src={data} className={css.image} />
    </div>
  );
};
