import React from "react";
import { BiNews } from "react-icons/bi";
import { useSelector } from "react-redux";
import "./Home.scss";
import Layout from "../Layout";

function Home() {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <div>
      {userInfo && (
        <Layout itemId={1}>
          <div className="home__container">
            <span className="home__news-title">
              <BiNews className="home__news-icon" />
              NEWS
            </span>
            <hr className="home__hr" />
            <div className="news__card-container">
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/11/1122_Thanksgiving-blog7-1-600x338.png"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Thanksgiving ideas: 5 ways to have an awesome Thanksgiving
                    with Kahoot!
                  </div>
                  <div className="news__description">
                    Whether you’re celebrating Thanksgiving or simply reflecting
                    on what you’re grateful for, here are some ideas to ensure
                    full hearts (and bellies!) when celebrating Thanksgiving
                    with your loved ones, colleagues, or students!
                  </div>
                </div>
              </div>
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/10/Game-modes-pedagogy-600x338.jpg"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Bring a new level of powerful pedagogy to classrooms with
                    Kahoot!’s game modes
                  </div>
                  <div className="news__description">
                    Disguise content learning in a game-oriented,
                    student-centered dynamic with all new game modes on Kahoot!
                  </div>
                </div>
              </div>
            </div>
            <div className="news__card-container">
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/10/World-teacher-day-image-600x338.jpg"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Celebrating World Teachers’ Day with Kahoot!
                  </div>
                  <div className="news__description">
                    Thanks for an awesome year of milestones and memories! We
                    appreciate you, teachers!
                  </div>
                </div>
              </div>
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/09/EDU-blogpost-recap-600x338.png"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Student-centered learning was front and center at the
                    Kahoot! EDU Fall Meetup 2022
                  </div>
                  <div className="news__description">
                    Teachers from around the world gathered yesterday to learn
                    about new approaches to student-centered learning from
                    shared teacher stories, Kahoot! ambassadors, and new Kahoot!
                    feature demos!
                  </div>
                </div>
              </div>
            </div>
            <div className="news__card-container">
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/07/ISTERecap_Blog_0722-600x338.png"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    ISTE 2022 Recap: Why teachers from around the world were
                    buzzing about Kahoot!
                  </div>
                  <div className="news__description">
                    Thousands of teachers gathered at the Kahoot! booth to check
                    out all the latest features and learn how they can make this
                    the ultimate back-to-school season!
                  </div>
                </div>
              </div>
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/11/introduce-new-topic-1-570x320.jpg"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Teacher Takeover: Using Kahoot! to introduce new topics
                  </div>
                  <div className="news__description">
                    Read on to learn how to empower students to explore their
                    knowledge of a new topic with Kahoot! tools.
                  </div>
                </div>
              </div>
            </div>
            <div className="news__card-container">
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/11/intuit-financial-literacy-2-new-570x320.png"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Build future-ready financial literacy with Intuit on Kahoot!
                    Academy
                  </div>
                  <div className="news__description">
                    Help students feel empowered as they grow real-world
                    personal finance skills with this new collection of
                    compelling kahoots from Intuit, now available to play for
                    free on Kahoot!.
                  </div>
                </div>
              </div>
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/10/Submarine2-570x320.png"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Teacher Takeover: Submarine squad for content,
                    collaboration, and celebration!
                  </div>
                  <div className="news__description">
                    Read on to learn how teachers everywhere have embedded the
                    all-new Submarine squad into their daily classroom routines!
                  </div>
                </div>
              </div>
            </div>
            <div className="news__card-container">
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/10/blogpost-cover-report-min-570x320.jpg"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    “Quiet constraint” and why knowledge sharing and digital
                    engagement are key to employee success
                  </div>
                  <div className="news__description">
                    Kahoot!’s 2022 Workplace Culture Report shows that many
                    employees may hold significant untapped knowledge resources,
                    creating the emerging workplace trend of “quiet constraint.”
                    Discover how engaging solutions for knowledge sharing can
                    help companies empower employees and build thriving
                    workplaces.
                  </div>
                </div>
              </div>
              <div className="news__card">
                <img
                  className="news__image"
                  src="https://kahoot.com/files/2022/11/3-570x320.png"
                  alt="News Photoo"
                />
                <div className="news__detail">
                  <div className="news__title">
                    Kahoot! announces Q3 record performance, with strong
                    momentum across all user segments, and powerful line-up for
                    2023
                  </div>
                  <div className="news__description">
                    With the ever-growing need for digital learning in school,
                    work and home, Kahoot! delivers a strong quarter on the
                    heels of a successful 2022 Back to School and Back to Work
                    season.
                  </div>
                </div>
              </div>
            </div>
            <div className="button__wrapper">
              <button className="button__load-more" type="button">
                Load more articles
              </button>
            </div>
          </div>
        </Layout>
      )}
    </div>
  );
}

export default Home;
