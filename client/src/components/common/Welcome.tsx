export const description =
  "Connect, communicate, and collaborate with Talktive! Our platform is designed to bring people together, making conversations easy and accessible. Whether you're looking to chat with friends, family, or colleagues, Talktive has you covered. Sign up now and join the conversation!";

type Props = {
  headClasses: string;
  descClasses: string;
};

const Welcome = ({ headClasses, descClasses }: Props) => {
  return (
    <div className="text-center">
      <h1 className={headClasses}>Welcome to Talktive!</h1>
      <p className={descClasses}>{description}</p>
    </div>
  );
};

export default Welcome;
