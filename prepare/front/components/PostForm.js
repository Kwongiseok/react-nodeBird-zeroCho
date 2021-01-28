import { Button, Form, Input } from "antd";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { addPost } from "../reducers/post";

//스타일 처음에 인라인으로 하고, 나중에 최적화를 하면된다.
const PostForm = (props) => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const [text, onChangeText, setText] = useInput();
  const imageInputRef = useRef(); // Ref 실제 돔에 접근하기 위해 사용

  const onClickImageUpload = useCallback(() => {
    imageInputRef.current.click();
  }, [imageInputRef.current]);

  useEffect(() => {
    if (addPostDone) {
      // post가 성공했을 때만 setText("") 수행
      setText("");
    }
  }, [addPostDone]);

  const dispatch = useDispatch();
  const onSubmit = useCallback(() => {
    dispatch(addPost(text)); // 액션은 객체
  }, [text]);
  return (
    <Form style={{ margin: "10px 0 20px" }} onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        palceholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" multiple hidden ref={imageInputRef} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => {
          <div key={v} style={{ display: "inline-block" }}>
            <img src={v} style={{ width: "200px" }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>;
        })}
      </div>
    </Form>
  );
};

export default PostForm;
