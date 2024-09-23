import Welcome from "../common/Welcome";

const HomePage = () => {
  return (
    <main className="flex flex-col justify-center items-center bg-gray-100">
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Welcome
            headClasses="text-2xl lg:text-5xl font-bold mb-4"
            descClasses="leading-8 w-full lg:w-1/2 mx-auto text-lg lg:text-2xl"
          />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
