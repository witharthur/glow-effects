import petr from "@/assets/avatar-petr.png";
import lesha from "@/assets/avatar-lesha.jpg";
import postRunner from "@/assets/post-runner.png";
import postGraffiti from "@/assets/post-graffiti.jpg";
import postHangover from "@/assets/post-hangover.jpg";
import type { Post } from "./types";

const petrFedko = { id: "u1", name: "Петр Федько", avatar: petr };
const leshaKrid = { id: "u2", name: "Леша Крид", avatar: lesha };

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
];

export const currentUser = {
  id: "me",
  name: "Вы",
  avatar: petr,
};
