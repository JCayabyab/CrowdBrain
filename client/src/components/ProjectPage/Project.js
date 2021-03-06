import React, { Component } from "react";
import { connect } from "react-redux";

import { fetchOwner } from "../../actions";
import { getFeatures, wipeFeatures } from "../../actions/featureActions";
import { wipeComments } from "../../actions/commentActions";
import {
  getProject,
  editProject,
  deleteProject
} from "../../actions/projectActions";
import LoadingWheel from "../utils/LoadingWheel";
import FeatureList from "./FeatureList";
import Detail from "../utils/Detail";
import Editable from "../utils/Editable";
import EditButton from "../utils/EditButton";
import PageHeader from "../utils/PageHeader";

class Project extends Component {
  async componentDidMount() {
    this.props.wipeFeatures();
    this.props.wipeComments();
    await this.props.getProject(this.props.match.params.projectId);
    this.props.getFeatures(this.props.match.params.projectId);
    this.props.fetchOwner(this.props.project._user._id);
  }

  render() {
    const { project, editProject } = this.props;

    if (project) {
      const list = [
        // for dropdown
        {
          title: `Make ${project.isPrivate ? "public" : "private"}`,
          function: () =>
            editProject(project._id, { isPrivate: !project.isPrivate })
        },
        {
          title: `Mark as ${project.completed ? "not " : ""}completed`,
          function: () =>
            editProject(project._id, { completed: !project.completed })
        },
        { title: `Delete`, function: this.handleDelete.bind(this) }
      ];
      return (
        <div>
          <PageHeader
            backURL="/dashboard"
            owner={project._user}
            list={list}
            object={project}
          >
            <Editable
              object={project}
              onSubmit={values => editProject(project._id, values)}
              section="title"
              defaultTitle="New Project"
            >
              <div style={{ textAlign: "center" }}>
                {project.title}
                <EditButton />
              </div>
            </Editable>
          </PageHeader>
          <hr style={{ marginTop: "4px" }} />
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <Detail
                object={project}
                onSubmit={values => editProject(project._id, values)}
              />
            </div>
            <div className="col-md-5 col-sm-12">
              <div>Features:</div>
              <hr style={{ margin: "5px 0px 12px" }} />
              <FeatureList projectId={project._id} />
            </div>
          </div>
        </div>
      );
    }
    return <LoadingWheel />;
  }

  async handleDelete() {
    await this.props.deleteProject(this.props.project._id);
    this.props.history.push(`/dashboard`);
  }
}

function mapStateToProps({ projects, owner }, ownProps) {
  return {
    project: projects ? projects[ownProps.match.params.projectId] : null,
    owner
  };
}

export default connect(
  mapStateToProps,
  {
    fetchOwner,
    getFeatures,
    getProject,
    editProject,
    deleteProject,
    wipeFeatures,
    wipeComments
  }
)(Project);
