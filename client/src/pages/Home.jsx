import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import heroImage from '../assets/hero.png';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Home() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      {/* hero section */}
      <div className="heroSection">
        <div className="leftSection">
          <h1>
            Your AI-Powered <span>Task</span> Assistant
          </h1>
          <p>AI-powered guidance for your daily tasks—designed to keep you productive, not overwhelmed.</p>
          <div className="btns">
            <button className="signup" onClick={() => navigate('/signup')} aria-label="Get started with SkillSync">
              Get Started
            </button>
            <button className="login" onClick={() => navigate('/login')} aria-label="Log in to SkillSync">
              Login
            </button>
          </div>
        </div>

        <div className="rightSection">
          <img src={heroImage} alt="Hero illustration for SkillSync" />
        </div>
      </div>

      {/* features section */}
      <div className="features">
        <div className="upper">
          <h2>
            Unleash Your <span>Productivity</span>
          </h2>
          <p>
            Maximize your productivity with personalized task recommendations powered by AI. Get tailored tasks that align
            with your skills, goals, and availability
          </p>
        </div>

        <div className="bottom">
          <div className="card">
            <div className="svg">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.144"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                </g>
              </svg>
            </div>

            <div className="content">
              <h4>Enter the Skill</h4>
              <p>Tell us about your goals, and let our AI craft personalized task recommendations for you.</p>
            </div>
          </div>

          {/* second card */}
          <div className="card">
            <div className="svg">
              <svg fill="#ffffff" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.336"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M 26.6875 12.6602 C 26.9687 12.6602 27.1094 12.4961 27.1797 12.2383 C 27.9062 8.3242 27.8594 8.2305 31.9375 7.4570 C 32.2187 7.4102 32.3828 7.2461 32.3828 6.9648 C 32.3828 6.6836 32.2187 6.5195 31.9375 6.4726 C 27.8828 5.6524 28.0000 5.5586 27.1797 1.6914 C 27.1094 1.4336 26.9687 1.2695 26.6875 1.2695 C 26.4062 1.2695 26.2656 1.4336 26.1953 1.6914 C 25.3750 5.5586 25.5156 5.6524 21.4375 6.4726 C 21.1797 6.5195 20.9922 6.6836 20.9922 6.9648 C 20.9922 7.2461 21.1797 7.4102 21.4375 7.4570 C 25.5156 8.2774 25.4687 8.3242 26.1953 12.2383 C 26.2656 12.4961 26.4062 12.6602 26.6875 12.6602 Z M 15.3438 28.7852 C 15.7891 28.7852 16.0938 28.5039 16.1406 28.0821 C 16.9844 21.8242 17.1953 21.8242 23.6641 20.5821 C 24.0860 20.5117 24.3906 20.2305 24.3906 19.7852 C 24.3906 19.3633 24.0860 19.0586 23.6641 18.9883 C 17.1953 18.0977 16.9609 17.8867 16.1406 11.5117 C 16.0938 11.0899 15.7891 10.7852 15.3438 10.7852 C 14.9219 10.7852 14.6172 11.0899 14.5703 11.5352 C 13.7969 17.8164 13.4687 17.7930 7.0469 18.9883 C 6.6250 19.0821 6.3203 19.3633 6.3203 19.7852 C 6.3203 20.2539 6.6250 20.5117 7.1406 20.5821 C 13.5156 21.6133 13.7969 21.7774 14.5703 28.0352 C 14.6172 28.5039 14.9219 28.7852 15.3438 28.7852 Z M 31.2344 54.7305 C 31.8438 54.7305 32.2891 54.2852 32.4062 53.6524 C 34.0703 40.8086 35.8750 38.8633 48.5781 37.4570 C 49.2344 37.3867 49.6797 36.8945 49.6797 36.2852 C 49.6797 35.6758 49.2344 35.2070 48.5781 35.1133 C 35.8750 33.7070 34.0703 31.7617 32.4062 18.9180 C 32.2891 18.2852 31.8438 17.8633 31.2344 17.8633 C 30.6250 17.8633 30.1797 18.2852 30.0860 18.9180 C 28.4219 31.7617 26.5938 33.7070 13.9140 35.1133 C 13.2344 35.2070 12.7891 35.6758 12.7891 36.2852 C 12.7891 36.8945 13.2344 37.3867 13.9140 37.4570 C 26.5703 39.1211 28.3281 40.8321 30.0860 53.6524 C 30.1797 54.2852 30.6250 54.7305 31.2344 54.7305 Z"
                  ></path>
                </g>
              </svg>
            </div>

            <div className="content">
              <h4>Generate Task</h4>
              <p>Watch as our AI curates personalized tasks crafted just for you.</p>
            </div>
          </div>

          {/* third card */}
          <div className="card">
            <div className="svg">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M8.5 12.5L10.5 14.5L15.5 9.5"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                </g>
              </svg>
            </div>

            <div className="content">
              <h4>Analyze the Task</h4>
              <p>Refine your selected tasks effortlessly with smart, AI-driven tools.</p>
            </div>
          </div>
        </div>
      </div>

      {/* third section */}
      <div className="thirdSection">
        <div className="leftText">
          <h2>
            Next-Gen Task Syncing,
            <br /> Powered by AI
          </h2>
          <p>Grab your AI-crafted task lists anytime – perfect for study plans, projects, or portfolios.</p>

          <div className="featureList">
            <div className="featureItem">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                    fill="#8646de"
                  ></path>
                </g>
              </svg>
              <span>Start Instantly with Zero Configuration</span>
            </div>
            <div className="featureItem">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                    fill="#8646de"
                  ></path>
                </g>
              </svg>
              <span>Works Seamlessly Across Devices</span>
            </div>
            <div className="featureItem">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                    fill="#8646de"
                  ></path>
                </g>
              </svg>
              <span>Live Sync Across Sessions and Devices</span>
            </div>
          </div>
        </div>

        <div className="rightImage">
          <iframe
            src="https://my.spline.design/animatedshapeblend-wMIxQjcyfH21SngsEDz18JE7/"
            frameBorder="0"
            width="100%"
            height="100%"
            title="Animated shape blend"
          ></iframe>
          <div className="black"></div>
        </div>
      </div>

      {/* fourth section */}
      <div className="ai-intro-section">
        {/* Background Spline Iframe */}
        <div className="spline-bg">
          <iframe
            src="https://my.spline.design/trails-BzKUlQqA81cqWLGRzFkusgix/"
            frameBorder="0"
            width="100%"
            height="100%"
            title="Spline Background"
          ></iframe>
        </div>

        <div className="red"></div>

        {/* Foreground Content */}
        <div className="ai-intro-content">
          <h2>
            Take Control of Your Time <br /> with AI Precision
          </h2>
          <p>
            Kickstart your progress with SkillSync — personalized AI-driven task plans that align with your goals in
            seconds.
          </p>
          <button onClick={() => navigate('/signup')} aria-label="Get started with SkillSync">
            Get Started
          </button>
        </div>
      </div>

      {/* frequently asked questions */}
      <div className="faq-container">
        {/* Left Text */}
        <div className="faq-left">
          <h2 className="faq-title">
            Frequently Asked <span className="faq-highlight">Questions</span>
          </h2>
          <p className="faq-description">
            Have questions? We’ve got answers. Learn how SkillSync helps you achieve your goals with smart AI
            recommendations.
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {[
            {
              question: 'What is SkillSync?',
              answer: 'SkillSync is an AI-powered platform that recommends task plans tailored to your goals, skills, and time.',
            },
            {
              question: 'Is SkillSync free?',
              answer: 'Yes, SkillSync is free to use with core features. Premium features may be added later.',
            },
            {
              question: 'Who can use SkillSync?',
              answer: 'Anyone — students, professionals, or freelancers — who wants help organizing tasks and boosting productivity.',
            },
            {
              question: 'How does it generate tasks?',
              answer: 'The AI processes your inputs like skill level, preferences, and deadlines to suggest optimal, actionable tasks.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="faq-item"
              role="button"
              aria-expanded={openIndex === idx}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setOpenIndex(openIndex === idx ? null : idx)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-toggle">{openIndex === idx ? '−' : '+'}</span>
              </div>
              {openIndex === idx && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <footer className="footer">
        {/* Logo */}
        <div className="footer-logo">SkillSync</div>

        {/* Links */}
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="footer-socials">
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Follow SkillSync on Twitter">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="Connect with SkillSync on LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Follow SkillSync on Instagram">
            <FaInstagram />
          </a>
        </div>

        {/* Bottom Text */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} SkillSync. Made with ♡ by your team.
        </div>
      </footer>
    </>
  );
}

export default Home;