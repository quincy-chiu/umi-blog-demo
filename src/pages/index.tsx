import { Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { history } from 'umi';
import './index.less';

const defaultUser = {
  email: '',
  name: '123',
  avatarUrl: '',
};

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>();
  const [curUser, setCurUser] = useState(defaultUser);

  async function refresh() {
    try {
      const res = await fetch('/api/posts');
      if (res.status !== 200) {
        console.error(await res.text());
      }
      setPosts(
        (await res.json()).sort(
          (p1: any, p2: any) => new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime(),
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function getCurUserInfo() {
    try {
      const email = document.cookie; // 忘了
      const res = await fetch('/api/user', {
        method: 'GET',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const user = await res.json();
      console.log(user);
      return user;
    } catch (err) {
      return defaultUser;
    }
  }

  useEffect(() => {
    refresh();
    getCurUserInfo().then((user) => {
      setCurUser(user);
    });
  }, []);

  return (
    <div className="flex flex-row w-full justify-center flex-wrap">
      <div className="nav-bar">
        <Avatar className="avatar" src={curUser.avatarUrl} />
        <div className="username">{curUser.name}</div>
      </div>
      {!posts && (
        <div className="fixed w-screen h-screen flex justify-center items-center">
          <p className="animate-pulse">Loading...</p>
        </div>
      )}
      {posts && (
        <div
          className="container flex flex-row w-full justify-center
       flex-wrap p-4 px-2 md:px-24 xl:px-64"
        >
          {posts.map((post) => (
            <div key={post.id} className="w-full lg:w-1/2 p-4">
              <div
                onClick={() => history.push(`/posts/${post.id}`)}
                className="w-full h-64 bg-white relative transition-all
          rounded-xl overflow-hidden cursor-pointer hover:shadow-xl"
              >
                <img src={post.imageUrl} alt="" className="absolute top-0 w-full h-full" />
                <div
                  className="absolute top-0 w-full h-full bg-black opacity-10
              hover:opacity-40 transition-all"
                />
                <div className="z-50 absolute bottom-0 p-4">
                  <p className="text-white font-extrabold">{post.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
