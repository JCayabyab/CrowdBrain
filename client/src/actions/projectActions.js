import axios from "axios";
import {
  GET_PROJECTS,
  UPDATE_PROJECTS,
  DELETE_PROJECT,
  WIPE_PROJECTS
} from "./types";

export const getProjects = () => async dispatch => {
  const res = await axios.get("/api/projects");

  dispatch({ type: GET_PROJECTS, payload: res.data });
};

export const getProject = projectId => async dispatch => {
  const body = { projectId };
  const res = await axios.post("/api/project", body);

  dispatch({ type: UPDATE_PROJECTS, payload: res.data });
};

export const createProject = values => async dispatch => {
  const res = await axios.post("/api/project/new");

  dispatch({ type: UPDATE_PROJECTS, payload: res.data });
};

export const editProject = (projectId, values) => async dispatch => {
  const { title, description, dateDue } = values;
  const body = { projectId };

  if (title) {
    body.title = title;
  }
  if (description) {
    body.description = description;
  }
  if (dateDue) {
    body.dateDue = dateDue;
  }
  
  const res = await axios.post("/api/project/edit", body);

  dispatch({ type: UPDATE_PROJECTS, payload: res.data });
};

export const deleteProject = projectId => async dispatch => {
  const body = { projectId };

  const res = await axios.post("/api/project/delete", body);

  dispatch({ type: DELETE_PROJECT, payload: res.data });
};

export function wipeProjects() {
  return { type: WIPE_PROJECTS };
}
