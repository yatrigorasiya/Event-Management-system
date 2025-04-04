export const About = () => {
  return (
    <>
      
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Image */}
          <div>
            <img
              src="/images/event_about.jpg"
              alt="Event Management"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          {/* Right: Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              About Our Event Management System
            </h2>
            <p className="text-gray-600 mb-6">
              Our Event Management System helps organizers plan, manage, and
              track events effortlessly. From creating events to sending
              invitations, everything is handled seamlessly.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                ✅{" "}
                <span className="ml-2 text-gray-700">
                  Easy event creation & management
                </span>
              </li>
              <li className="flex items-center">
                ✅{" "}
                <span className="ml-2 text-gray-700">
                  Automated email invitations
                </span>
              </li>
              <li className="flex items-center">
                ✅ <span className="ml-2 text-gray-700">Real-time booking</span>
              </li>
              <li className="flex items-center">
                ✅{" "}
                <span className="ml-2 text-gray-700">
                  Secure user authentication
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
