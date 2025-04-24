import React, { lazy, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import Dungeon from '../components/Dungeon';
import SlimeFun from '../components/SlimeFun';
import Crates from '../components/Crates';
import Quests from '../components/Quests';
import Play from '../components/Play';
import Sidebar from '../components/Sidebar';

const Home = () => {
  return (
    <div className="flancraft-home">
      <Sidebar />

      <section id="hero"><HeroSection /></section>
      <section id="dungeon"><Dungeon /></section>
      <section id="slimefun"><SlimeFun /></section>
      <section id="crates"><Crates /></section>
      <section id="quests"><Quests /></section>
      <section id="play"><Play /></section>
    </div>
  );
};

export default Home;
