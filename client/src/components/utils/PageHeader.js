import React from "react";
import styled from "styled-components";

import BackButton from "./BackButton";
import Dropdown from "./Dropdown";
import { connect } from "react-redux";

const Container = styled.div`
  font-size: 16pt;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  & > * {
    align-items: center;
  }
`;

const HeaderText = styled.div`
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const OwnerText = styled.div`
  font-size: 10pt;
  margin: 0px 3px;
`;

const PageHeader = props => {
  const { backURL, children, user, owner, list } = props;

  return (
    <Container>
      <div>
        <BackButton to={backURL} />
      </div>
      <HeaderText>{children}</HeaderText>
      <Right>
        {owner._id === user._id ? (
          <Dropdown list={list} />
        ) : (
          <OwnerText>
            {`created by ${owner.firstName} ${owner.lastName}`}
          </OwnerText>
        )}
      </Right>
    </Container>
  );
};

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(PageHeader);
