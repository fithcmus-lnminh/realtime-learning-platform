import { ApiResposeCodeNumber } from "../../constants/api";
import {
  GET_ALL_PRESENTATIONS_SUCCESS,
  GET_PRESENTATION_SUCCESS,
  SET_TOTAL_STUDENTS
  // GET_PRESENTATION_SUCCESS
} from "../../constants/presentationConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

const API_URL = process.env.REACT_APP_SERVER_URL;

/* eslint-disable import/prefer-default-export */
export const getAllPresentations = (setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get(`${API_URL}/api/presentation`);

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      if (setLoading) {
        setLoading(false);
      }
      dispatch({
        type: GET_ALL_PRESENTATIONS_SUCCESS,
        payload: res.data.presentations
      });
    } else {
      /* eslint-disable no-lonely-if */
      if (setLoading) {
        setLoading(false);
      }
    }
  } catch (error) {
    if (setLoading) {
      setLoading(false);
    }
  }
};

/* eslint-disable import/prefer-default-export */
export const createPresentation =
  (data, handleClose, setLoading, reset, setMessage) => async (dispatch) => {
    try {
      const res = await $axios.post(
        `${API_URL}/api/presentation`,
        toSnake(data)
      );

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        reset();
        handleClose();
        if (setMessage) {
          setMessage({
            success: true,
            data: "Create presentation successfully",
            open: true
          });
        }

        dispatch(getAllPresentations(setLoading));
      } else {
        if (setLoading) {
          setLoading(false);
        }
        if (setMessage) {
          setMessage({
            success: false,
            data: res.message,
            open: true
          });
        }
      }
    } catch (error) {
      console.log("error:", error);
      if (setLoading) {
        setLoading(false);
      }
      if (setMessage) {
        setMessage({
          success: false,
          data: error.message,
          open: true
        });
      }
    }
  };

/* eslint-disable import/prefer-default-export */
export const updatePresentation =
  (presentationId, data, handleClose, setLoading, reset, setMessage) =>
  async (dispatch) => {
    try {
      const res = await $axios.put(
        `${API_URL}/api/presentation/${presentationId}`,
        toSnake(data)
      );

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        reset();
        handleClose();
        if (setMessage) {
          setMessage({
            success: true,
            data: "Update presentation successfully",
            open: true
          });
        }

        dispatch(getAllPresentations(setLoading));
      } else {
        if (setLoading) {
          setLoading(false);
        }
        if (setMessage) {
          setMessage({
            success: false,
            data: res.message,
            open: true
          });
        }
      }
    } catch (error) {
      console.log("error:", error);
      if (setLoading) {
        setLoading(false);
      }
      if (setMessage) {
        setMessage({
          success: false,
          data: error.message,
          open: true
        });
      }
    }
  };

/* eslint-disable import/prefer-default-export */
export const deletePresentation =
  (presentationId, handleClose, setLoading, setMessage) => async (dispatch) => {
    try {
      const res = await $axios.delete(
        `${API_URL}/api/presentation/${presentationId}`
      );

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        handleClose();
        if (setMessage) {
          setMessage({
            success: true,
            data: "Delete presentation successfully",
            open: true
          });
        }

        dispatch(getAllPresentations(setLoading));
      } else {
        if (setLoading) {
          setLoading(false);
        }
        if (setMessage) {
          setMessage({
            success: false,
            data: res.message,
            open: true
          });
        }
      }
    } catch (error) {
      console.log("error:", error);
      if (setLoading) {
        setLoading(false);
      }
      if (setMessage) {
        setMessage({
          success: false,
          data: error.message,
          open: true
        });
      }
    }
  };

/* eslint-disable import/prefer-default-export */
export const getPresentationById = (id) => async (dispatch) => {
  try {
    const res = await $axios.get(`${API_URL}/api/presentation/${id}`);

    const newSlides = res.data.presentation.slides.map((slide, index) => ({
      ...slide,
      active: index === 0
    }));

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      dispatch({
        type: GET_PRESENTATION_SUCCESS,
        payload: { ...res.data.presentation, slides: newSlides }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/* eslint-disable import/prefer-default-export */
export const createMultipleChoiceSlide =
  (presentationId) => async (dispatch) => {
    try {
      const res = await $axios.post(
        `${API_URL}/api/presentation/${presentationId}/multiple-choice`
      );

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        const res2 = await $axios.get(
          `${API_URL}/api/presentation/${presentationId}`
        );

        const newSlides = res2.data.presentation.slides.map((slide, index) => ({
          ...slide,
          active: index === res2.data.presentation.slides.length - 1
        }));

        /* eslint-disable prefer-destructuring */
        if (res2.code === ApiResposeCodeNumber.Success) {
          dispatch({
            type: GET_PRESENTATION_SUCCESS,
            payload: { ...res2.data.presentation, slides: newSlides }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

/* eslint-disable import/prefer-default-export */
export const updateMultipleChoiceSlideQuestion =
  (presentationId, slideId, question) => async (dispatch) => {
    await $axios.put(
      `${API_URL}/api/presentation/${presentationId}/multiple-choice/${slideId}`,
      {
        question
      }
    );

    const res = await $axios.get(
      `${API_URL}/api/presentation/${presentationId}`
    );

    const newSlides = res.data.presentation.slides.map((slide, index) => ({
      ...slide,
      active:
        index ===
        res.data.presentation.slides.findIndex((s) => s.content.id === slideId)
    }));

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      dispatch({
        type: GET_PRESENTATION_SUCCESS,
        payload: { ...res.data.presentation, slides: newSlides }
      });
    }
  };

/* eslint-disable import/prefer-default-export */
export const createNewOption =
  (presentationId, slideId) => async (dispatch) => {
    await $axios.post(
      `${API_URL}/api/presentation/${presentationId}/multiple-choice/${slideId}/option`
    );

    const res = await $axios.get(
      `${API_URL}/api/presentation/${presentationId}`
    );

    const newSlides = res.data.presentation.slides.map((slide, index) => ({
      ...slide,
      active:
        index ===
        res.data.presentation.slides.findIndex((s) => s.content.id === slideId)
    }));

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      dispatch({
        type: GET_PRESENTATION_SUCCESS,
        payload: { ...res.data.presentation, slides: newSlides }
      });
    }
  };

/* eslint-disable import/prefer-default-export */
export const updateTitleOption =
  (presentationId, slideId, optionId, content) => async (dispatch) => {
    await $axios.put(
      `${API_URL}/api/presentation/${presentationId}/multiple-choice/${slideId}/option/${optionId}`,
      { content }
    );

    const res = await $axios.get(
      `${API_URL}/api/presentation/${presentationId}`
    );

    const newSlides = res.data.presentation.slides.map((slide, index) => ({
      ...slide,
      active:
        index ===
        res.data.presentation.slides.findIndex((s) => s.content.id === slideId)
    }));

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      dispatch({
        type: GET_PRESENTATION_SUCCESS,
        payload: { ...res.data.presentation, slides: newSlides }
      });
    }
  };

/* eslint-disable import/prefer-default-export */
export const deleteOption = (presentationId, slideId, optionId) => async () => {
  await $axios.delete(
    `${API_URL}/api/presentation/${presentationId}/multiple-choice/${slideId}/option/${optionId}`
  );
};

/* eslint-disable import/prefer-default-export */
export const setTotalStudents = (data) => (dispatch) => {
  dispatch({ type: SET_TOTAL_STUDENTS, payload: data });
};
