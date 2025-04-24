import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Home() {
  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      {/* Sticky Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">LearnAI</h1>
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold">
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-3 py-2 rounded-full font-semibold hover:bg-indigo-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-24"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Master Your Learning with AI
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Get personalized task recommendations tailored to your goals and progress.
            </p>
            <Link
              to="/signup"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
            >
              Start Learning Now
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="https://media.istockphoto.com/id/1287582736/photo/robot-humanoid-use-laptop-and-sit-at-table-for-big-data-analytic.webp?a=1&b=1&s=612x612&w=0&k=20&c=F20ufOpQFFYfnJNNNiAbSFmP2JC5fc9WlNNz3ICih-Q="
              alt="AI Learning Illustration"
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why LearnAI Stands Out
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Tasks',
                desc: 'AI-driven tasks adapt to your unique learning pace and knowledge level.',
              },
              {
                title: 'Track Your Progress',
                desc: 'Visualize your growth with intuitive dashboards and insights.',
              },
              {
                title: 'Seamless Experience',
                desc: 'Learn effortlessly on any device with our responsive design.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                variants={fadeIn}
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-indigo-600 text-white py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of students thriving with AI-powered education.
          </p>
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
          >
            Get Started Today
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;