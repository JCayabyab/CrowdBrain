import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";

import { fetchOwner } from "../../actions";
import { getProject } from "../../actions/projectActions";
import {
  getFeature,
  editFeature,
  deleteFeature
} from "../../actions/featureActions";
import { getComments, createComment } from "../../actions/commentActions";
import LoadingWheel from "../utils/LoadingWheel";
import Detail from "../utils/Detail";
import SubtaskList from "./SubtaskList";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import Editable from "../utils/Editable";
import EditButton from "../utils/EditButton";
import PageHeader from "../utils/PageHeader";

const ProjectText = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: color 0.15s linear;

  &:hover {
    text-decoration: none;
    color: #57b;
  }
`;

class Feature extends Component {
  async componentDidMount() {
    await this.props.getFeature(this.props.match.params.featureId);
    this.props.getComments(this.props.feature._id);
    this.props.fetchOwner(this.props.feature._user);
  }

  render() {
    const { feature, editFeature } = this.props;
    const projectURL = `/p/${this.props.match.params.projectId}`;

    if (feature) {
      const project = feature._project;
      const list = [
        // for dropdown
        {
          title: `Mark as ${feature.completed ? "not " : ""}completed`,
          function: () =>
            editFeature(feature._id, { completed: !feature.completed })
        },
        { title: `Delete`, function: this.handleDelete.bind(this) }
      ];

      return (
        <div>
          <PageHeader
            backURL={projectURL}
            list={list}
            owner={feature._user}
            object={feature}
          >
            <ProjectText to={projectURL}>{project.title}</ProjectText>
            <i className="fas fa-caret-right" style={{ margin: "0px 15px" }} />
            <Editable
              style={{ fontWeight: "bold" }}
              object={feature}
              onSubmit={values => editFeature(feature._id, values)}
              section="title"
              defaultTitle="New Feature"
            >
              {feature.title}
              <EditButton />
            </Editable>
          </PageHeader>
          <hr style={{ marginTop: "4px" }} />
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <Detail
                object={feature}
                onSubmit={values => editFeature(feature._id, values)}
              />
              <hr />
              <div>
                <CommentForm
                  onSubmit={values => this.props.createComment(feature, values)}
                />
                <hr />
                <CommentList />
              </div>
            </div>
            <div className="col-md-5 col-sm-12">
              <SubtaskList feature={feature} />
            </div>
          </div>
        </div>
      );
    }
    return <LoadingWheel />;
  }

  async handleDelete() {
    await this.props.deleteFeature(this.props.feature._id);
    this.props.history.push(`/p/${this.props.match.params.projectId}`);
  }
}

function mapStateToProps({ features }, ownProps) {
  return {
    feature: features ? features[ownProps.match.params.featureId] : null
  };
}

export default connect(
  mapStateToProps,
  {
    fetchOwner,
    getProject,
    getFeature,
    editFeature,
    deleteFeature,
    getComments,
    createComment
  }
)(withRouter(Feature));
