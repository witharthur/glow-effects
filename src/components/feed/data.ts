import petr from "@/assets/avatar-petr.png";
import lesha from "@/assets/avatar-lesha.jpg";
import ler04ka from "@/assets/avatar-lerochka.jpg";
import postRunner from "@/assets/post-runner.png";
import postGraffiti from "@/assets/post-graffiti.jpg";
import postHangover from "@/assets/post-hangover.jpg";
import type { Post } from "./types";

const petrFedko = { id: "u1", name: "Петр Федько", avatar: petr };
const leshaKrid = { id: "u2", name: "Леша Крид", avatar: lesha };
const ler04kaUser = { id: "u3", name: "Ler04ka", avatar: ler04ka };
const vladZhdun = { id: "u4", name: "Влад Ждун", avatar: petr };
const goshaRub = { id: "u5", name: "Гоша Рубчинский", avatar: lesha };

const sampleComments = [
  { id: "c1", author: leshaKrid, text: "Хороший гайд!", likes: 2 },
  { id: "c2", author: petrFedko, text: "Спасибо, начал бегать с понедельника 🔥", likes: 3, liked: true },
  { id: "c3", author: leshaKrid, text: "А какие кроссовки посоветуете?", likes: 1 },
  { id: "c4", author: petrFedko, text: "Пробовал — реально работает, через две недели стало легче.", likes: 5 },
  { id: "c5", author: leshaKrid, text: "Жду продолжения!", likes: 0 },
];

export const initialPosts: Post[] = [
  {
    id: "p1",
    author: petrFedko,
    image: postRunner,
    title: "Подготовка к лету",
    text: "Когда вы начинаете бегать по утрам, но чувствуете, что каждый шаг даётся",
    likes: 12,
    comments: sampleComments.slice(0, 3),
  },
  {
    id: "p2",
    author: leshaKrid,
    image: postGraffiti,
    title: "Подготовка к лету",
    text: "Когда вы начинаете бегать по утрам, но чувствуете, что каждый шаг даётся",
    likes: 12,
    comments: sampleComments,
    liked: true,
  },
  {
    id: "p3",
    author: petrFedko,
    image: postRunner,
    title: "Эксклюзивный гайд по тренировкам",
    text: "Полная программа на 12 недель — от разминки до соревнований.",
    likes: 0,
    comments: [],
    locked: true,
  },
  {
    id: "p4",
    author: leshaKrid,
    image: postHangover,
    title: "Подготовка к лету",
    text: "Когда вы начинаете бегать по утрам, но чувствуете, что каждый шаг даётся. Когда вы начинаете бегать по утрам, но чувствуете, что каждый шаг даётся. Когда вы начинаете бегать по утрам, но чувствуете, что каждый шаг даётся. Когда вы начинаете бегать по утрам, но чувствуете, что каждый шаг даётся.",
    likes: 12,
    comments: sampleComments.slice(0, 4),
    long: true,
  },
  {
    id: "p5",
    author: ler04kaUser,
    image: postRunner,
    title: "Подготовка к лету",
    text: "Когда вы начинаете бегать по утрам, но чувствуете, что каждый шаг даётся",
    likes: 12,
    comments: sampleComments.slice(0, 3),
  },
  // --- Locked / private posts ---
  {
    id: "p6",
    author: leshaKrid,
    image: postGraffiti,
    title: "Секреты уличного арта",
    text: "Эксклюзивный контент о граффити и стрит-арте.",
    likes: 0,
    comments: [],
    locked: true,
  },
  {
    id: "p7",
    author: ler04kaUser,
    image: postHangover,
    title: "Мой утренний ритуал",
    text: "Полный гайд по утренним привычкам для продуктивного дня.",
    likes: 0,
    comments: [],
    locked: true,
  },
  {
    id: "p8",
    author: vladZhdun,
    image: postRunner,
    title: "Тренировки для начинающих",
    text: "Пошаговая программа для тех, кто только начинает свой путь в спорте.",
    likes: 0,
    comments: [],
    locked: true,
  },
  {
    id: "p9",
    author: ler04kaUser,
    image: postGraffiti,
    title: "Мои любимые места в городе",
    text: "Топ-10 мест, которые стоит посетить этим летом.",
    likes: 0,
    comments: [],
    locked: true,
  },
  {
    id: "p10",
    author: goshaRub,
    image: postHangover,
    title: "Модные тренды сезона",
    text: "Разбираем главные тренды уличной моды на лето.",
    likes: 0,
    comments: [],
    locked: true,
  },
];

export const currentUser = {
  id: "me",
  name: "Вы",
  avatar: petr,
};
