import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
  MdClose
} from "react-icons/md";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { getPresentationById } from "../../redux/actions/presentationAction";
import "./PresentPresentation.scss";

function PresentPresentation() {
  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFullScreen = useFullScreenHandle();
  const [loading, setLoading] = useState(false);
  const { presentationDetail } = useSelector((state) => state.presentation);
  const [currentSlide, setCurrentSlide] = useState(
    presentationDetail?.slides[0]
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const getPresentationDetail = async () => {
    setLoading(true);
    await dispatch(getPresentationById(param.id));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleGoToPreviousSlide = () => {
    setCurrentSlideIndex(currentSlideIndex - 1);
    setCurrentSlide(presentationDetail?.slides[currentSlideIndex - 1]);
  };

  const handleGoToNextSlide = () => {
    setCurrentSlideIndex(currentSlideIndex + 1);
    setCurrentSlide(presentationDetail?.slides[currentSlideIndex + 1]);
  };

  const handleExitPresent = () => {
    navigate(`/presentation/${param.id}`);
  };

  useEffect(() => {
    getPresentationDetail();
  }, []);

  useEffect(() => {
    setCurrentSlide(presentationDetail?.slides[0]);
  }, [presentationDetail]);

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress size={60} color="primary" />
        </Box>
      ) : (
        <FullScreen handle={handleFullScreen}>
          <div className="present__container">
            <div className="present__wrapper">
              <div className="present__exit">
                <button
                  type="button"
                  className="present__controller-button"
                  onClick={handleExitPresent}
                >
                  <MdClose />
                </button>
              </div>
              <div className="present__controller">
                {handleFullScreen.active ? (
                  <button
                    type="button"
                    className="present__controller-button"
                    style={{ marginRight: 28 }}
                    onClick={handleFullScreen.exit}
                  >
                    <BiCollapse />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="present__controller-button"
                    style={{ marginRight: 28 }}
                    onClick={handleFullScreen.enter}
                  >
                    <BiExpand />
                  </button>
                )}
                <button
                  type="button"
                  className="present__controller-button"
                  disabled={currentSlideIndex === 0}
                  onClick={handleGoToPreviousSlide}
                >
                  <MdOutlineArrowBackIosNew />
                </button>
                <button
                  type="button"
                  className="present__controller-button"
                  disabled={
                    currentSlideIndex === presentationDetail.slides.length - 1
                  }
                  onClick={handleGoToNextSlide}
                >
                  <MdOutlineArrowForwardIos />
                </button>
              </div>
              <div className="present__content">
                <p className="present__content-header">
                  Go to bla bla and enter code{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {presentationDetail?.accessCode}
                  </span>
                </p>
                {currentSlide?.slideType === "MultipleChoice" && (
                  <div className="present__content-main">
                    <h1
                      style={{
                        marginTop: 16,
                        wordWrap: "anywhere",
                        fontSize: 48
                      }}
                    >
                      {currentSlide?.content.question || "Multiple Choice"}
                    </h1>
                    {currentSlide?.content?.options.length > 0 && (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <BarChart
                          width={1000}
                          height={550}
                          data={currentSlide?.content.options}
                          barSize={90}
                          margin={{ top: 20 }}
                        >
                          <XAxis dataKey="content" />
                          <YAxis tick={false} axisLine={false} />
                          <Bar dataKey="numUpvote" fill="#2a518f">
                            <LabelList dataKey="numUpvote" position="top" />
                          </Bar>
                        </BarChart>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </FullScreen>
      )}
    </div>
  );
}

export default PresentPresentation;
