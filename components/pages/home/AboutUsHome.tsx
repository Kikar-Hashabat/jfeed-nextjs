import { memo } from "react";

const AboutUsHome = memo(() => {
  return (
    <section className="mx-auto px-4 py-12 bg-gray-50 text-gray-800 mt-10">
      <h2 className="text-4xl font-bold text-center mb-6 text-primary-600">
        Stay Updated with Israel News – JFEED
      </h2>

      <p className="text-lg text-center mb-8">
        Welcome to JFEED, your comprehensive source for Israel and Jewish world
        news, offering breaking updates, analysis, and cultural insights.
      </p>

      <div className="max-w-3xl mx-auto space-y-8">
        <section aria-labelledby="why-jfeed">
          <h3 id="why-jfeed" className="text-2xl font-semibold mb-4">
            Why JFEED?
          </h3>
          <ul className="space-y-2 text-base">
            <li>Real-time Israel political, security, and cultural updates</li>
            <li>Expert commentary and analysis</li>
            <li>Jewish art, traditions, and lifestyle coverage</li>
          </ul>
        </section>

        <section aria-labelledby="coverage">
          <h3 id="coverage" className="text-2xl font-semibold mb-4">
            Comprehensive Coverage
          </h3>
          <p>
            From breaking news to cultural events, JFEED delivers accurate,
            timely reporting on all significant developments in Israel and
            Jewish communities worldwide.
          </p>
        </section>

        <section aria-labelledby="accessibility">
          <h3 id="accessibility" className="text-2xl font-semibold mb-4">
            Available Everywhere
          </h3>
          <p>
            Access JFEED's mobile-optimized platform across all devices, staying
            connected to essential news wherever you are.
          </p>
        </section>
      </div>
    </section>
  );
});

AboutUsHome.displayName = "AboutUsHome";

export default AboutUsHome;
