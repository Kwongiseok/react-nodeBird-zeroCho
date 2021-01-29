import Router from "next/router";
import Head from "next/head";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import NickNameEditForm from "../components/NickNameEditForm";

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NickNameEditForm />
        <FollowList header="팔로잉" data={me.Follwings} />
        <FollowList header="팔로워 목록" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
