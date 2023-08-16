import Feed from "@/components/Feed"

const Home: () => JSX.Element = () => (
  <section className="w-full flex-col flex-center">
    <h1 className="head_text text_center text-black dark:text-dark-title" data-testid="tid-title">
      Discover and Share&nbsp;
      <br className="xl:hidden" />
      <span className="orange_gradient text-center dark:text-dark-title">AI Powered Prompts</span>
    </h1>
    <p className="desc text-center" data-testid="tid-description">
      Promptopia is an open-source AI prompting tool for modern world to
      discover, create and share creative prompts
    </p>
    <Feed/>
  </section>
)
export default Home