import AppLayout from "../components/AppLayout";
import Head from "next/head";
import FollowList from "../components/FollowList";
import NickNameEditForm from "../components/NickNameEditForm";
const Profile = () => {
  const followerList = [
    { nickName: "기석" },
    { nickName: "석기" },
    { nickName: "파이썬" },
  ];
  const followingList = [
    { nickName: "기석" },
    { nickName: "석기" },
    { nickName: "파이썬" },
  ];

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NickNameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
