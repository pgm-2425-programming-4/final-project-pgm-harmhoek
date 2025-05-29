export const API_URL = import.meta.env.PROD
  ?'https://taskure-api.onrender.com/api'
  :'http://localhost:1337/api';


export const API_TOKEN = import.meta.env.PROD
    ? 'PROD token'
    : '13e6451c82a1c0c3a25a0a606f9e7b3a67f4daf44149720c0cc068ab3885bb2db56404e8e1e4003a9e19a0b16eef6cf796d22741d925c5ec5bfad4f95f51916da0626fd39e339ce19f918e8ad0a546d5c3cfab89cbe9c96e24c6ef37756b105550b1727910359aee762a106f90b73fc49a48d69e1dc26ebd736edc021daf6759';


export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];