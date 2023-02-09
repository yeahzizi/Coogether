/* eslint-disable */
import React, { Component, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CarouselBtn from '../../Btn/CarouselBtn/CarouselBtn';

import * as C from './ChatComponentStyle';

import './ChatComponent.css';
import axios from 'axios';

import clock from '../../../assets/icon/clock.svg';

export default class ChatComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageList: [],
      message: '',
      ingredients: [],
      startTime: '',
      recipeIngredient: 'recipe',
    };
    this.chatScroll = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handlePressKey = this.handlePressKey.bind(this);
    this.close = this.close.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.openFullScreenMode = this.openFullScreenMode.bind(this);
    this.closeFullScreenMode = this.closeFullScreenMode.bind(this);
    this.recipeIngredient = this.recipeIngredient.bind(this);
    // 재료 가져오기
    this.ingredient = this.ingredient.bind(this);
  }
  componentWillMount() {
    this.ingredient();
  }
  componentDidMount() {
    this.props.user
      .getStreamManager()
      .stream.session.on('signal:chat', event => {
        const data = JSON.parse(event.data);
        let messageList = this.state.messageList;
        messageList.push({
          connectionId: event.from.connectionId,
          nickname: data.nickname,
          message: data.message,
        });
        const document = window.document;
        setTimeout(() => {
          const userImg = document.getElementById(
            'userImg-' + (this.state.messageList.length - 1)
          );
          const video = document.getElementById('video-' + data.streamId);
          const avatar = userImg.getContext('2d');
          // avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
          this.props.messageReceived();
        }, 50);
        this.setState({ messageList: messageList });
        this.scrollToBottom();
      });
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handlePressKey(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  // 재료,시작시간 가져오기
  async ingredient() {
    const res = await axios.get(
      `http://i8b206.p.ssafy.io:9000/room/${
        this.props.user.getStreamManager().stream.session.sessionId
      }`
    );
    console.log(res);
    const recipeId = res.data.recipe.recipeId;
    const resIng = await axios.get(
      `http://i8b206.p.ssafy.io:9000/ingredient/list/${recipeId}`
    );
    const targetTime = new Date(res.data.cookingRoomStartTime);
    const targetH = targetTime.getHours();
    const targetM = targetTime.getMinutes();
    this.setState({ startTime: `${targetH}:${targetM}` });
    this.setState({ ingredients: resIng.data });
  }
  // 레시피 재료 전환
  recipeIngredient(target) {
    if (target === 'left') {
      this.setState({ recipeIngredient: 'recipe' });
    } else {
      this.setState({ recipeIngredient: 'ingredient' });
    }
  }
  sendMessage() {
    console.log(this.state.message);
    if (this.props.user && this.state.message) {
      let message = this.state.message.replace(/ +(?= )/g, '');
      if (message !== '' && message !== ' ') {
        const data = {
          message: message,
          nickname: this.props.user.getNickname(),
          streamId: this.props.user.getStreamManager().stream.streamId,
        };
        this.props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: 'chat',
        });
      }
    }
    this.setState({ message: '' });
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop =
          this.chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  }

  close() {
    this.openFullScreenMode();
    this.props.close(undefined);
  }

  // 전체화면 설정
  openFullScreenMode() {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen();
    else if (document.documentElement.webkitRequestFullscreen)
      // Chrome, Safari (webkit)
      document.documentElement.webkitRequestFullscreen();
    else if (document.documentElement.mozRequestFullScreen)
      // Firefox
      document.documentElement.mozRequestFullScreen();
    else if (document.documentElement.msRequestFullscreen)
      // IE or Edge
      document.documentElement.msRequestFullscreen();
  }

  // 전체화면 해제
  closeFullScreenMode() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen)
      // Chrome, Safari (webkit)
      document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen)
      // Firefox
      document.mozCancelFullScreen();
    else if (document.msExitFullscreen)
      // IE or Edge
      document.msExitFullscreen();
  }

  render() {
    return (
      <C.WaitContainer>
        <C.WaitDivideBox>
          <C.WaitTitle>오늘은 모두 요리사</C.WaitTitle>

          {/* 유저 정보 입력 공간, 사진도 같이 가져와야함 */}
          <C.WrapUserList>
            <C.WrapUserInfo>
              <C.ThisUserImg src={this.props.userImg} />
              <div>{this.props.user.nickname}</div>
            </C.WrapUserInfo>
            {this.props.remoteUsers.map((v, a) => {
              return (
                <C.WrapUserInfo>
                  <C.ThisUserImg src={v.img} />
                  <div>{v.nickname}</div>
                </C.WrapUserInfo>
              );
            })}
          </C.WrapUserList>
          {/* 재료 및 레시피 정보 입력 공간 */}

          <C.ContentWrap>
            <CarouselBtn
              left={'레시피'}
              right={'재료'}
              recipeIngredient={this.recipeIngredient}
            />
            {this.state.recipeIngredient === 'recipe' ? (
              <C.RecipeWrap>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontSize: '2vh',
                  }}
                >
                  <img
                    src={clock}
                    alt="시계아이콘"
                    style={{ marginRight: '0.5vw' }}
                  />
                  {this.state.startTime} 시작
                </div>
                <h1>레시피 이름</h1>
                {this.props.recipe.map(v => {
                  return (
                    <C.StepTitle>
                      {v.recipeStepNum < 10
                        ? '0' + String(v.recipeStepNum)
                        : v.recipeStepNum}
                      <div>{v.recipeStepContent}</div>
                    </C.StepTitle>
                  );
                })}
              </C.RecipeWrap>
            ) : (
              <C.IngWrap>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontSize: '2vh',
                  }}
                >
                  <img
                    src={clock}
                    alt="시계아이콘"
                    style={{ marginRight: '0.5vw' }}
                  />
                  {this.state.startTime} 시작
                </div>
                <h1>레시피 이름</h1>
                {this.state.ingredients.map(v => {
                  return (
                    <C.StepIngTitle>
                      <div> {v.ingredient.ingredientName}</div>
                      <div>{v.ingredientAmount}</div>
                    </C.StepIngTitle>
                  );
                })}
              </C.IngWrap>
            )}
          </C.ContentWrap>
        </C.WaitDivideBox>
        <C.WaitDivideBox>
          <C.ContentWrap>
            <C.ChatComponent>
              <C.DivBox></C.DivBox>
              <C.ChatBox>
                <C.ChatTitle>
                  {/* 방 이름+ 채팅 */}
                  <span>
                    {/* {
                      this.props.user.getStreamManager().stream.session
                        .sessionId
                    } */}
                    채팅
                  </span>
                </C.ChatTitle>
                <div>참가자 ({this.props.remoteUsers.length + 1})</div>
                <div className="message-wrap" ref={this.chatScroll}>
                  {this.state.messageList.map((data, i) => (
                    <div
                      key={i}
                      id="remoteUsers"
                      className={
                        'message' +
                        (data.connectionId !== this.props.user.getConnectionId()
                          ? ' left'
                          : ' right')
                      }
                    >
                      <canvas
                        id={'userImg-' + i}
                        width="60"
                        height="60"
                        className="user-img"
                      />
                      <div className="msg-detail">
                        <div className="msg-info">
                          <p> {data.nickname}</p>
                        </div>
                        <div className="msg-content">
                          <span className="triangle" />
                          <p className="text">{data.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
                <div id="messageInput">
                  <input
                    placeholder="여기에 메세지를 입력해주세요"
                    id="chatInput"
                    value={this.state.message}
                    onChange={this.handleChange}
                    onKeyPress={this.handlePressKey}
                  />
                  <button onClick={this.sendMessage}> 보내기</button>
                </div>
              </C.ChatBox>
            </C.ChatComponent>
          </C.ContentWrap>
        </C.WaitDivideBox>
        <C.ExitBox>
          <Link to="/Main">나가기</Link>
          <button onClick={this.close}>시작하기</button>
        </C.ExitBox>
      </C.WaitContainer>
    );
  }
}
