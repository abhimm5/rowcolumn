import React, { useEffect, useState } from 'react';


// Importing images
import HeroImage from './images/6.png';
import ss2 from './images/10.png';
import ss3 from './images/11.png';

import icon from './images/logomain.svg'
import './Intro/Intro.css';
import { Layout, Grid } from 'rowscolumns/react';

const IntroPage = () => {

  const handleLoginClick = () => {
    // Navigate to login or handle click
    console.log("Login clicked");
  };


  const navBar = Grid.col({ sm: 4, md: 2 }, { lg: (10).col("auto", "auto", 1, "auto"), sm: (10).col("auto", "auto") }, { sm: 4, md: 2 }).offset([1, 4, 6]).props({ gap: "5px" })

  const hero = Grid.row("auto", "auto", "auto", "auto", "auto")



  return (
    <>
      {/* Full width navbar with inner container */}
      <Layout layout={Grid.col({ sm: 1, md: 2, lg: 4 }, { sm: (10).col('auto', 'auto', 1, 'auto').childProps({ display: 'none' }, [2]), lg: (10).col('auto', 'auto', 1, 'auto') }, { sm: 1, md: 2, lg: 4 }).offset([1, 4, 6]).props({ gap: '5px' })} >
        <img src={icon} width="60px" />
        <h4>gupt messenger</h4>
        <button className="cta-button rounded-large" onClick={handleLoginClick}>Chat</button>
      </Layout>

      {/* Main content wrapper */}
      <Layout layout={hero}>

        <h1>Speak Freely,</h1>
        <h1>Connect Privately,</h1>
        <h1>Share Experiences and Feelings</h1>
        <p className="subheadline">
          Real-time messaging without real-world compromise where privacy isn't a feature—it's the foundation.
        </p>
        <button className="cta-button rounded-large">Download</button>
      </Layout>

      {/* Full width features section */}
      <div className="full-width-section features fade-in">
        <div className="section-inner">
          <h4>Introduction</h4>
          <h2>Why Gupt Messenger</h2>
          <div className="feature-grid">
            <div className="feature-card hover-grow">
              <h3>No Names, Just You</h3>
              <p>Connect anonymously—no phone numbers, no emails, no identifiers.</p>
            </div>
            <div className="feature-card hover-grow">
              <h3>Conversations That Vanish</h3>
              <p>You decide how long your messages live. Nothing lingers—by design.</p>
            </div>
            <div className="feature-card hover-grow">
              <h3>Your Data, Your Device</h3>
              <p>Everything stays on your device. Nothing stored, nothing shared.</p>
            </div>
            <div className="feature-card hover-grow">
              <h3>Unbreakable Privacy</h3>
              <p>End-to-end encryption. Just you and the person you're talking to—always.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue the rest inside 1280px content container */}
      <div className="page-container">
        {/* Image with overlaid comparison content */}
        <section className="image-highlight-with-text fade-in">
          <div className="overlay-text">
            <h2>Why Privacy Matters More Than Ever</h2>
            <p>
              Big platforms profit from your conversations. We never even see them. We built this for people who believe
              communication should be sacred—not sold.
            </p>
          </div>
        </section>







        <section className="technology fade-in">
          <h4>Unmatched Features :</h4>
          <h2>Things that you will not find anywhere.</h2>


          <section className="technology-section fade-in">
            <div className="feature-row">
              <div className="feature-image-wrapper">
                <img
                  src={ss2}
                  alt="Anonymous Chatting"
                  className="feature-img"
                />
              </div>
              <div className="feature-text">
                <h2 className="text-align-straight">Be More Expressive</h2>
                <h3 className="text-align-straight">#1 Live Reaction & Chatting</h3>
                <p className="text-align-straight">Express instantly with live emoji reactions and real-time messaging.</p>
                <p className="text-align-straight"> Just press and hold the emoji it will give display you live reactions.</p>
              </div>
            </div>
          </section>



          <section className="technology-section fade-in">
            <div className="feature-row reverse">
              <div className="feature-image-wrapper">
                <img
                  src={ss3}
                  alt="Anonymous Chatting"
                  className="feature-img"
                />
              </div>
              <div className="feature-text">
                <h2 className="text-align-reverse">Beyond Just Disappearing</h2>
                <h3 className="text-align-reverse">#2 Ephemeral Chat Controls</h3>
                <p className="text-align-reverse">
                  Control how long messages live with advanced auto-delete and custom
                  expiry tools.
                </p>
                <p className="text-align-reverse">
                  Recall limit, clear messages and many more which let you control your messages and make them ephemeral.
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>


      {/* Full width features section */}
      <div className="full-width-section features fade-in">
        <div className="section-inner">
          <h4>About Us</h4>
          <h2>Absolute Made In India</h2>
          <div className="feature-grid">
            <p>This app was first devised in 2018, it is an idea and compassion which made us keep on the way and finally we present this app to you. We are a small team who worked day and night. Each and every portion of Gupt messenger is made by India, and we are very proud of it.</p>
          </div>
        </div>
      </div>


      <div className="full-width-section features fade-in">
        <div className="section-inner">
          <h2>Speak Freely. Right Now.</h2>
          <p>No sign-up. No tracking. Just real, private messaging.</p>
          <button className="cta-button rounded-large last-section-button" onClick={handleLoginClick} >Launch Now</button>

        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2025 Gupt Messenger — Designed for Privacy, Built for People.</p>
      </footer>
    </>
  );
};


const App: React.FC = () => {


  return (
    <IntroPage />
  );
};

export default App;
