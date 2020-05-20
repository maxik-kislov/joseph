import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px auto;
  padding: 15px 10px 15px 10px;
  max-width: 700px;
  height: 100%;
  border: 0.5px solid gray;
  border-radius: 3px;
`;

const Avatar = styled.img`
  min-width: 50px;
  height: 50px;
  border-radius: 50px;
  margin: 0 10px 0 0;
  background-color: black;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Helvetica Neue, sans-serif;
`;

const UserName = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
`;

const TweetBody = styled.p`
  font-size: 14px;
  margin: 8px 0 8px 0;
`;

export const Card = ({ tweet }) => {
  return (
    <CardContainer>
      <Avatar src={tweet.image} alt={`${tweet.username}'s avatar`} />
      <InfoBlock>
        <UserName>{tweet.username}</UserName>
        <TweetBody>{tweet.text}</TweetBody>
      </InfoBlock>
    </CardContainer>
  );
};

export default Card;
