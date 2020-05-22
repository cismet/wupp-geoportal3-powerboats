import Color from 'color';
import ColorHash from 'color-hash';
import createSVGPie from 'create-svg-pie';
import L from 'leaflet';
import queryString from 'query-string';
import React from 'react';
import SVGInline from 'react-svg-inline';
import createElement from 'svg-create-element';
import { poiColors } from '../constants/colors.js';
import store from '../redux/store';
import IconLink from '../components/commons/IconLink';

const fallbackSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="311.668" height="311.668">
        <path class="bg-fill" fill="#C32D6A"  d="M0-.661h313.631v313.63H0z"/>
        <path class="fg-fill" fill="#FFF"  d="M292.827 156.794c0 18.76-3.584 36.451-10.733 53.095-7.187 16.681-16.929 31.17-29.302 43.523-12.354 12.392-26.88 22.152-43.523 29.302s-34.335 10.733-53.094 10.733c-18.74 0-36.432-3.584-53.104-10.733-16.653-7.149-31.17-16.91-43.533-29.302-12.354-12.354-22.125-26.843-29.273-43.523-7.159-16.644-10.743-34.335-10.743-53.095 0-18.74 3.584-36.432 10.743-53.084 7.149-16.653 16.919-31.17 29.273-43.533 12.363-12.354 26.88-22.144 43.533-29.293 16.671-7.148 34.363-10.742 53.104-10.742 18.759 0 36.45 3.594 53.094 10.742 16.644 7.149 31.17 16.939 43.523 29.293 12.373 12.363 22.115 26.88 29.302 43.533 7.149 16.652 10.733 34.344 10.733 53.084zm-24.612 0c0-15.347-2.936-29.854-8.77-43.523-5.853-13.66-13.859-25.575-24.021-35.746-10.143-10.132-22.058-18.14-35.727-23.983-13.649-5.881-28.177-8.808-43.523-8.808-15.356 0-29.855 2.926-43.543 8.808-13.66 5.843-25.556 13.851-35.708 23.983-10.152 10.171-18.159 22.086-24.021 35.746-5.853 13.669-8.789 28.177-8.789 43.523 0 15.385 2.936 29.874 8.789 43.524 5.862 13.669 13.869 25.584 24.021 35.745 10.152 10.142 22.048 18.149 35.708 24.002 13.688 5.872 28.187 8.788 43.543 8.788 15.347 0 29.874-2.916 43.523-8.788 13.669-5.853 25.584-13.86 35.727-24.002 10.161-10.161 18.168-22.076 24.021-35.745 5.834-13.65 8.77-28.139 8.77-43.524zm-32.79 0c0 10.943-2.078 21.237-6.234 30.865-4.155 9.608-9.855 17.997-17.005 25.184-7.149 7.149-15.537 12.812-25.146 16.968-9.628 4.156-19.923 6.253-30.865 6.253-10.943 0-21.219-2.097-30.846-6.253s-18.035-9.818-25.184-16.968c-7.158-7.187-12.811-15.575-16.977-25.184-4.166-9.628-6.244-19.922-6.244-30.865 0-10.924 2.078-21.18 6.244-30.846 4.166-9.627 9.818-18.016 16.977-25.165 7.149-7.178 15.557-12.83 25.184-16.996s19.903-6.263 30.846-6.263c10.942 0 21.237 2.097 30.865 6.263 9.608 4.166 17.996 9.818 25.146 16.996 7.149 7.149 12.85 15.538 17.005 25.165 4.156 9.666 6.234 19.922 6.234 30.846z"/>
    </svg>
`;
const ladestationSVG = `<?xml version="1.0" encoding="UTF-16"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Creator: CorelDRAW -->
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="100mm" height="100.179mm" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
viewBox="0 0 43.613 43.6911"
 xmlns:xlink="http://www.w3.org/1999/xlink">
 <g id="Ebene_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <path class="bg-fill" d="M39.2425 0l-34.8823 0c-2.39811,0 -4.36019,1.96605 -4.36019,4.36902l0 34.953c0,2.40296 1.96208,4.36902 4.36019,4.36902l34.8823 0c2.39811,0 4.36024,-1.96605 4.36024,-4.36902l0 -34.953c0,-2.40296 -1.96212,-4.36902 -4.36024,-4.36902z"/>
  <path class="fg-fill" d="M31.1974 3.338c0.0832752,-0.00297099 0.0123646,-0.00445649 0.0645317,-0.00445649l3.23392 0c1.99642,0 3.25817,1.32677 3.79597,3.02456 0.101756,0.321304 0.1759,0.659036 0.222475,1.00507l5.09875 -0.00974311 0 1.56685 -5.07402 0.00969941c-0.0425551,0.418342 -0.124869,0.827203 -0.246898,1.21238 -0.5374,1.69622 -1.79841,3.02106 -3.79627,3.02106l-3.23392 0c-0.0543954,0 0.0297973,-0.00166026 -0.08712,-0.00511185l-0.0860277 -0.00249039c-0.580829,-0.0318508 -1.03032,-0.513195 -1.02989,-1.08799l-0.00266515 0 0 -0.774642 -4.4228 0c-0.434333,0 -0.786439,-0.352106 -0.786439,-0.786439 0,-0.434333 0.352106,-0.786439 0.786439,-0.786439l4.4228 0 0 -2.76569 -4.52696 0c-0.434333,0 -0.786439,-0.352106 -0.786439,-0.786439 0,-0.434333 0.352106,-0.786439 0.786439,-0.786439l4.52696 0 0 -0.952596c0,-0.603242 0.489034,-1.09228 1.09228,-1.09228 0.0163841,0 0.0326809,0.000393219 0.0488903,0.00113597z"/>
  <path class="fg-fill" d="M21.4573 32.4083l4.05313 -8.4277 -10.3892 0.0484971 6.33608 8.3792zm4.80833 -9.998l1.18765 -2.46951 -2.34162 0.337863c-0.429221,0.0610364 -0.826766,-0.237417 -0.887802,-0.666638 -0.0610364,-0.429221 0.237417,-0.826766 0.666638,-0.887802l6.1053 -0.880855c0.429221,-0.0610364 0.826766,0.237417 0.887802,0.666638 0.0610364,0.429221 -0.237417,0.826766 -0.666638,0.887802l-1.89589 0.27355 -1.59695 3.32048 3.5402 4.77264c0.925333,-0.457664 1.96732,-0.71496 3.06934,-0.71496 1.9145,0 3.64812,0.776346 4.90301,2.03124 1.25489,1.25489 2.03124,2.98851 2.03124,4.90301 0,1.9145 -0.776346,3.64807 -2.03124,4.90301 -1.25489,1.25489 -2.98851,2.03124 -4.90301,2.03124 -1.91445,0 -3.64807,-0.776346 -4.90301,-2.03124 -1.10713,-1.10718 -1.84162,-2.5869 -1.9993,-4.23471l-5.85652 0c-0.272283,0 -0.512234,-0.13837 -0.6534,-0.348611l-7.99817 -10.5773c-0.0360888,-0.047798 -0.0658424,-0.0983486 -0.0894793,-0.150778l-0.927911 3.91149c1.00044,0.347082 1.89693,0.916726 2.63003,1.64982 1.25489,1.25494 2.03124,2.98851 2.03124,4.90301 0,1.9145 -0.776346,3.64812 -2.03124,4.90301 -1.25489,1.25489 -2.98851,2.03124 -4.90301,2.03124 -1.9145,0 -3.64807,-0.776346 -4.90301,-2.03124 -1.25489,-1.25489 -2.03124,-2.98851 -2.03124,-4.90301 0,-1.91445 0.776346,-3.64807 2.03124,-4.90301 1.25494,-1.25489 2.98851,-2.03124 4.90301,-2.03124 0.249389,0 0.495719,0.0133258 0.738335,0.0390161l2.34036 -9.86535c0.0910522,-0.384438 0.450105,-0.635399 0.832358,-0.602063l4.53391 0.00703426c0.432629,0 0.783381,0.350752 0.783381,0.783381 0,0.432629 -0.350752,0.783381 -0.783381,0.783381l-3.97947 -0.00616044 -1.0436 4.39903c0.00725272,-0.00589829 0.0145928,-0.0116655 0.0221077,-0.0173453 0.156021,-0.117791 0.341751,-0.168473 0.522632,-0.156938l12.6661 -0.0590703zm0.690625 2.17822l-4.08345 8.49066 4.5852 0c0.202421,-1.55282 0.918692,-2.94447 1.97265,-3.99843 0.163186,-0.163142 0.334499,-0.318158 0.513195,-0.46448l-2.98759 -4.02775zm-15.416 4.4391l-1.20714 5.08848c-0.100053,0.422449 -0.523725,0.683765 -0.946173,0.583713 -0.422449,-0.100053 -0.683765,-0.523725 -0.583713,-0.946173l1.20102 -5.06261c-0.122728,-0.00838868 -0.246549,-0.0127578 -0.371418,-0.0127578 -1.48025,0 -2.82065,0.600271 -3.7909,1.57047 -0.970204,0.970247 -1.57047,2.31069 -1.57047,3.7909 0,1.48025 0.600271,2.82069 1.57047,3.7909 0.970247,0.970204 2.31065,1.57047 3.7909,1.57047 1.48025,0 2.82069,-0.600271 3.7909,-1.57047 0.970204,-0.970204 1.57047,-2.31065 1.57047,-3.7909 0,-1.48025 -0.600271,-2.82065 -1.57047,-3.7909 -0.529885,-0.529885 -1.17022,-0.94945 -1.88348,-1.22112zm20.6811 0.0271758l3.22213 4.34385c0.257865,0.347781 0.184988,0.838868 -0.162793,1.09673 -0.140554,0.104203 -0.304483,0.15436 -0.46697,0.154229l0 0.0024467 -5.80016 0c0.150909,1.21317 0.707271,2.30068 1.52914,3.1226 0.970247,0.970204 2.31069,1.57047 3.7909,1.57047 1.48025,0 2.82069,-0.600271 3.7909,-1.57047 0.970204,-0.970247 1.57047,-2.31065 1.57047,-3.7909 0,-1.48025 -0.600271,-2.82069 -1.57047,-3.7909 -0.970204,-0.970204 -2.31065,-1.57047 -3.7909,-1.57047 -0.750001,0 -1.464,0.154186 -2.11224,0.43241zm-1.33922 0.826504c-0.117573,0.0990039 -0.23082,0.202945 -0.339436,0.311561 -0.768132,0.768132 -1.30431,1.7684 -1.49437,2.88632l4.20588 0 -2.37207 -3.19788z"/>
 </g>
</svg>

`;

const verleihstationSVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 284 284" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="Ebene_x0020_1">
        <path d="M255.119,0L28.346,0C12.756,0 0,12.756 0,28.346L0,255.118C0,270.709 12.756,283.464 28.346,283.464L255.119,283.464C270.709,283.464 283.464,270.709 283.464,255.118L283.464,28.346C283.464,12.756 270.709,0 255.119,0Z" style="fill:rgb(231,120,23);"/>
        <g transform="matrix(1.34837,0.558531,-0.558531,1.34837,-59.5632,-88.0451)">
            <path d="M127.52,31.01C123.714,29.139 119.533,28.002 115.209,27.711C111.119,27.437 106.918,27.923 102.804,29.268C102.704,29.308 102.57,29.357 102.399,29.416C102.364,29.427 102.284,29.451 102.159,29.486C98.004,30.938 94.328,33.134 91.233,35.871C87.996,38.733 85.384,42.183 83.513,45.99C81.642,49.797 80.505,53.978 80.215,58.302C79.938,62.429 80.437,66.67 81.809,70.82C81.875,70.983 81.91,71.072 81.919,71.097C81.956,71.204 81.987,71.312 82.014,71.421C83.466,75.548 85.653,79.2 88.374,82.278C91.236,85.514 94.686,88.126 98.494,89.997C102.332,91.884 106.548,93.025 110.905,93.304C115.088,93.571 119.398,93.038 123.622,91.598C127.838,90.16 131.568,87.958 134.707,85.201L134.7,85.194C137.984,82.307 140.624,78.836 142.501,75.017C144.387,71.179 145.528,66.963 145.807,62.606C146.075,58.423 145.541,54.113 144.101,49.889C142.663,45.669 140.457,41.936 137.697,38.795C134.826,35.528 131.354,32.894 127.52,31.01L127.52,31.01ZM109.834,70.157C111.565,73.141 113.288,75.224 115.006,76.403C116.734,77.588 118.465,77.816 120.201,77.083C120.911,76.783 121.546,76.418 122.103,75.988C122.659,75.56 123.155,75.056 123.589,74.476L123.592,74.468C123.991,73.94 124.302,73.179 124.523,72.186C124.761,71.11 124.888,69.79 124.902,68.226C124.912,67.109 124.967,66.175 125.069,65.426C125.185,64.581 125.367,63.933 125.617,63.48C125.858,63.046 126.149,62.669 126.494,62.347C126.846,62.019 127.241,61.761 127.682,61.575C128.446,61.252 129.187,61.076 129.903,61.044C130.648,61.01 131.354,61.133 132.021,61.409L132.029,61.413C132.694,61.694 133.283,62.12 133.792,62.686C134.278,63.225 134.687,63.886 135.015,64.663C135.753,66.412 136.034,68.274 135.859,70.248C135.688,72.179 135.078,74.203 134.035,76.319C132.99,78.438 131.616,80.279 129.915,81.839C128.222,83.394 126.213,84.662 123.894,85.641C121.688,86.572 119.451,87.043 117.181,87.055C114.919,87.066 112.632,86.619 110.319,85.713C107.998,84.804 105.842,83.353 103.853,81.36C102.088,79.592 100.45,77.39 98.938,74.756L95.773,76.093L95.773,76.094L95.773,76.094L95.741,76.105C95.202,76.333 94.691,76.301 94.213,76.003C93.867,75.786 93.589,75.44 93.382,74.964L93.38,74.965L93.38,74.964L93.369,74.932C93.212,74.561 93.11,74.13 93.058,73.639C93.013,73.204 93.008,72.703 93.042,72.136L93.04,72.13C93.076,71.554 93.15,71.084 93.262,70.721C93.446,70.121 93.765,69.725 94.215,69.535L95.992,68.785L95.923,68.622C95.704,68.104 95.465,67.508 95.206,66.835C95.058,66.448 94.888,65.998 94.698,65.485L91.779,66.717C91.243,66.944 90.736,66.916 90.262,66.63L90.263,66.629C89.906,66.414 89.624,66.063 89.419,65.577C89.256,65.192 89.15,64.755 89.097,64.264C89.05,63.829 89.045,63.324 89.079,62.748L89.077,62.742C89.114,62.166 89.187,61.695 89.299,61.333C89.483,60.733 89.802,60.337 90.252,60.147L92.611,59.151C91.125,53.419 91.115,48.583 92.584,44.646C94.16,40.42 97.396,37.273 102.289,35.207C104.423,34.306 106.526,33.744 108.598,33.518C110.681,33.291 112.738,33.404 114.771,33.855L114.775,33.857C116.839,34.324 118.575,35.1 119.982,36.186C121.415,37.292 122.497,38.709 123.226,40.437C123.504,41.095 123.654,41.751 123.675,42.406C123.695,43.063 123.583,43.717 123.338,44.367C123.099,45.022 122.758,45.583 122.316,46.049C121.868,46.522 121.325,46.892 120.688,47.161C120.025,47.441 119.399,47.602 118.814,47.64C118.168,47.682 117.576,47.576 117.038,47.32L117.037,47.323C116.601,47.12 116.131,46.83 115.629,46.455C115.16,46.105 114.662,45.677 114.138,45.173L114.121,45.157C113.542,44.575 112.967,44.088 112.402,43.696L112.404,43.692C111.857,43.314 111.322,43.03 110.803,42.838C110.374,42.68 109.834,42.643 109.19,42.727C108.47,42.821 107.639,43.066 106.7,43.462C105.655,43.903 104.819,44.465 104.188,45.147C103.572,45.814 103.14,46.61 102.889,47.535L102.89,47.535C102.633,48.519 102.566,49.685 102.69,51.031C102.79,52.109 103.014,53.303 103.362,54.612L112.64,50.695C113.179,50.467 113.689,50.484 114.168,50.749L114.17,50.746C114.557,50.961 114.861,51.326 115.079,51.841L115.25,52.244L115.236,52.279C115.321,52.559 115.382,52.858 115.421,53.176C115.476,53.629 115.485,54.133 115.446,54.686C115.406,55.253 115.325,55.719 115.203,56.079C115.006,56.661 114.682,57.048 114.233,57.239L105.544,60.907L106.421,63.109L106.42,63.11C106.577,63.483 106.735,63.842 106.891,64.184L116.573,60.096L116.572,60.095L116.572,60.094L116.604,60.084C117.137,59.859 117.641,59.869 118.114,60.12C118.499,60.325 118.801,60.672 119.015,61.165L119.017,61.164L119.029,61.196C119.203,61.608 119.321,62.06 119.382,62.551C119.44,63.005 119.449,63.513 119.41,64.073C119.37,64.641 119.288,65.107 119.166,65.468C118.969,66.049 118.645,66.437 118.196,66.627L109.834,70.157L109.834,70.157Z" style="fill:white;"/>
        </g>
        <path d="M201.185,116.269C203.97,115.873 206.549,117.809 206.945,120.594C207.341,123.379 205.404,125.958 202.62,126.354L190.319,128.129L179.958,149.672L202.927,180.637C208.93,177.667 215.691,175.998 222.841,175.998C235.262,175.998 246.509,181.035 254.651,189.176C262.793,197.318 267.83,208.566 267.83,220.987C267.83,233.408 262.793,244.655 254.651,252.797C246.509,260.939 235.262,265.976 222.841,265.976C210.42,265.976 199.172,260.939 191.03,252.797C183.847,245.614 179.082,236.014 178.059,225.323L140.062,225.323C138.296,225.323 136.739,224.425 135.823,223.061L83.931,154.436C83.697,154.126 83.504,153.798 83.351,153.458L77.331,178.835C83.821,181.087 89.638,184.783 94.394,189.539C102.536,197.681 107.573,208.928 107.573,221.349C107.573,233.771 102.536,245.018 94.394,253.16C86.252,261.301 75.005,266.338 62.584,266.338C50.163,266.338 38.915,261.301 30.773,253.16C22.632,245.018 17.595,233.77 17.595,221.349C17.595,208.929 22.632,197.681 30.773,189.539C38.915,181.397 50.163,176.36 62.584,176.36C64.202,176.36 65.8,176.447 67.374,176.614L82.558,112.608C83.149,110.114 85.478,108.485 87.958,108.702L117.374,108.747C120.181,108.747 122.457,111.023 122.457,113.83C122.457,116.637 120.181,118.912 117.374,118.912L91.556,118.872L84.785,147.413C84.832,147.375 84.879,147.337 84.928,147.301C85.94,146.536 87.145,146.207 88.319,146.282L170.496,145.899L178.202,129.877L163.009,132.069C160.224,132.465 157.645,130.529 157.249,127.744C156.853,124.959 158.79,122.38 161.574,121.984L201.185,116.269L201.185,116.269ZM139.3,210.765L165.596,156.087L98.192,156.402L139.3,210.765L139.3,210.765ZM174.976,160.031L148.483,215.118L178.232,215.118C179.545,205.043 184.192,196.015 191.03,189.177C192.089,188.118 193.2,187.112 194.36,186.163L174.976,160.031L174.976,160.031ZM62.584,256.134C72.187,256.134 80.884,252.239 87.179,245.945C93.473,239.65 97.368,230.953 97.368,221.35C97.368,211.746 93.473,203.049 87.179,196.754C83.741,193.317 79.586,190.594 74.959,188.832L67.127,221.846C66.478,224.586 63.729,226.282 60.988,225.633C58.247,224.984 56.552,222.235 57.201,219.494L64.993,186.648C64.197,186.594 63.394,186.565 62.584,186.565C52.98,186.565 44.283,190.46 37.988,196.754C31.694,203.049 27.799,211.746 27.799,221.35C27.799,230.953 31.694,239.65 37.988,245.945C44.283,252.239 52.98,256.134 62.584,256.134L62.584,256.134ZM222.841,255.771C232.444,255.771 241.141,251.877 247.436,245.582C253.73,239.287 257.625,230.591 257.625,220.987C257.625,211.383 253.73,202.686 247.436,196.392C241.141,190.097 232.444,186.203 222.841,186.203C217.975,186.203 213.342,187.203 209.137,189.008L230.042,217.191C231.715,219.447 231.242,222.633 228.985,224.306C228.073,224.982 227.01,225.308 225.956,225.307L225.956,225.323L188.325,225.323C189.304,233.194 192.913,240.25 198.246,245.582C204.541,251.877 213.237,255.771 222.841,255.771L222.841,255.771ZM200.448,194.371C199.685,195.013 198.95,195.687 198.246,196.392C193.262,201.375 189.783,207.865 188.55,215.118L215.838,215.118L200.448,194.37L200.448,194.371Z" style="fill:white;fill-rule:nonzero;"/>
        <path d="M202.73,22.159C203.271,22.14 202.811,22.13 203.149,22.13L224.131,22.13C237.083,22.13 245.269,30.738 248.759,41.753C249.419,43.838 249.9,46.029 250.202,48.274L283.282,48.211L283.282,58.376L250.362,58.439C250.086,61.154 249.552,63.806 248.761,66.305C245.274,77.31 237.093,85.906 224.131,85.906L203.149,85.906C202.796,85.906 203.342,85.895 202.584,85.873L202.026,85.856C198.257,85.65 195.341,82.527 195.344,78.798L195.327,78.798L195.327,73.772L166.632,73.772C163.814,73.772 161.529,71.487 161.529,68.669C161.529,65.851 163.814,63.567 166.632,63.567L195.327,63.567L195.327,45.623L165.956,45.623C163.138,45.623 160.854,43.339 160.854,40.521C160.854,37.703 163.138,35.419 165.956,35.419L195.327,35.419L195.327,29.238C195.327,25.324 198.499,22.152 202.413,22.152C202.519,22.152 202.625,22.154 202.73,22.159L202.73,22.159Z" style="fill:white;"/>
    </g>
</svg>
`;

export const getConnectorImageUrl = (type) => {
	switch (type) {
		case 'Schuko':
			return '/images/emob/Schuko_plug.png';
		case 'Typ 2':
			return '/images/emob/Type_2_mennekes.png';
		case 'CHAdeMO':
			return '/images/emob/Chademo_type4.png';
		case 'CCS':
			return '/images/emob/Type1-ccs.png';
		case 'Tesla Supercharger':
			return '/images/emob/Type_2_mennekes.png';
		case 'Drehstrom':
			return '/images/emob/cce3.png';
		default:
			return undefined;
	}
};

export const getFeatureStyler = (svgSize = 24, colorizer = getColorForProperties) => {
	return (feature) => {
		var color = Color(colorizer(feature.properties));
		let radius = svgSize / 2; //needed for the Tooltip Positioning
		let canvasSize = svgSize;
		if (feature.selected) {
			canvasSize = svgSize + 12;
		}

		let selectionBox = canvasSize - 6;
		let badge = feature.properties.svgBadge || fallbackSVG; //|| `<image x="${(svgSize - 20) / 2}" y="${(svgSize - 20) / 2}" width="20" height="20" xlink:href="/pois/signaturen/`+getSignatur(feature.properties)+`" />`;

		let svg = `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / 12}" y="${svgSize / 12}"  width="${svgSize -
			2 * svgSize / 12}" height="${svgSize - 2 * svgSize / 12}" viewBox="0 0 ${feature
			.properties.svgBadgeDimension.width} ${feature.properties.svgBadgeDimension
			.height}">       
                    ${badge}
                </svg>
                </svg>  `;

		if (feature.selected) {
			let selectionOffset = (canvasSize - selectionBox) / 2;

			let badgeDimension = svgSize - 2 * svgSize / 12;
			let innerBadgeOffset = (selectionBox - badgeDimension) / 2;

			svg =
				`<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}">
                    <style>
                    /* <![CDATA[ */
                        #badgefor_${feature.id} .bg-fill  {
                            fill: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .bg-stroke  {
                            stroke: ${colorizer(feature.properties)};
                        }
                        #badgefor_${feature.id} .fg-fill  {
                            fill: white;
                        }
                        #badgefor_${feature.id} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <rect x="${selectionOffset}" y="${selectionOffset}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
                <svg x="${selectionOffset + innerBadgeOffset}" y="${selectionOffset +
					innerBadgeOffset}" width="${badgeDimension}" height="${badgeDimension}" viewBox="0 0 ` +
				feature.properties.svgBadgeDimension.width +
				` ` +
				feature.properties.svgBadgeDimension.height +
				`">
                ${badge}

                </svg>
                </svg>`;
		}

		const style = {
			radius,
			fillColor: color,
			color: color.darken(0.5),
			opacity: 1,
			fillOpacity: 0.8,
			svg,
			svgSize: canvasSize
		};
		return style;
	};
};
export const getPoiClusterIconCreatorFunction = (
	svgSize = 24,
	colorizer = getColorForProperties
) => {
	//return a function because the functionCall of the iconCreateFunction cannot be manipulated
	return (cluster) => {
		var childCount = cluster.getChildCount();
		const values = [];
		const colors = [];

		const r = svgSize / 1.5;
		// Pie with default colors
		let childMarkers = cluster.getAllChildMarkers();

		let containsSelection = false;
		let inCart = false;
		for (let marker of childMarkers) {
			values.push(1);
			colors.push(Color(colorizer(marker.feature.properties)));
			if (marker.feature.selected === true) {
				containsSelection = true;
			}
			if (marker.feature.inCart) {
				inCart = true;
			}
		}
		const pie = createSVGPie(values, r, colors);

		let canvasSize = svgSize / 3.0 * 5.0;
		let background = createElement('svg', {
			width: canvasSize,
			height: canvasSize,
			viewBox: `0 0 ${canvasSize} ${canvasSize}`
		});

		//Kleiner Kreis in der Mitte
		// (blau wenn selektion)
		let innerCircleColor = '#ffffff';
		if (containsSelection) {
			innerCircleColor = 'rgb(67, 149, 254)';
		}

		//inner circle
		pie.appendChild(
			createElement('circle', {
				cx: r,
				cy: r,
				r: svgSize / 3.0,
				'stroke-width': 0,
				opacity: '0.5',
				fill: innerCircleColor
			})
		);

		// //Debug Rectangle -should be commnented out
		// background.appendChild(createElement('rect', {
		//     x:0,
		//     y:0,
		//     width: canvasSize,
		//     height: canvasSize,
		//     "stroke-width":1,
		//     stroke: "#000000",
		//     opacity: "1",
		//     fill: "#ff0000"

		// }));

		background.appendChild(pie);

		// Umrandung
		background.appendChild(
			createElement('circle', {
				cx: canvasSize / 2.0,
				cy: canvasSize / 2.0,
				r: r,
				'stroke-width': 2,
				stroke: '#000000',
				opacity: '0.5',
				fill: 'none'
			})
		);

		if (inCart) {
			background
				.appendChild(
					createElement('text', {
						x: '50%',
						y: '50%',
						'text-anchor': 'middle',
						'font-family': 'FontAwesome',
						fill: '#fff',
						'font-size': '26',
						dy: '.4em',
						opacity: '0.5'
					})
				)
				.appendChild(document.createTextNode('\uf005'));
		}

		background
			.appendChild(
				createElement('text', {
					x: '50%',
					y: '50%',
					'text-anchor': 'middle',
					dy: '.3em'
				})
			)
			.appendChild(document.createTextNode(childCount));

		pie.setAttribute('x', (canvasSize - r * 2) / 2.0);
		pie.setAttribute('y', (canvasSize - r * 2) / 2.0);

		var divIcon = L.divIcon({
			className: 'leaflet-data-marker',
			html: background.outerHTML || new XMLSerializer().serializeToString(background), //IE11 Compatibility
			iconAnchor: [ canvasSize / 2.0, canvasSize / 2.0 ],
			iconSize: [ canvasSize, canvasSize ]
		});
		//console.log(background.outerHtml)
		return divIcon;
	};
};

export const getColorForProperties = (properties) => {
	if (properties.typ === 'Verleihstation') {
		return '#EC7529';
	} else if (properties.online === true) {
		return '#1EA342';
	} else {
		return '#999999';
	}
};
export const getColorFromLebenslagenCombination = (combination) => {
	let qColorRules;
	let colorCandidate;
	let lookup = null;
	try {
		qColorRules = queryString.parse(store.getState().routing.location.search).colorRules;

		if (qColorRules) {
			try {
				lookup = JSON.parse(qColorRules);
			} catch (error) {
				console.error(error);
			}
		}
	} catch (error) {
		//problem dduring colorRulesn override
	}
	if (lookup === null) {
		lookup = poiColors;
	}

	colorCandidate = lookup[combination];
	if (colorCandidate) {
		return colorCandidate;
	} else {
		let colorHash = new ColorHash({ saturation: 0.3 });
		const c = colorHash.hex(combination);
		console.debug(
			"Keine vordefinierte Farbe für '" +
				combination +
				"' vorhanden. (Ersatz wird automatisch erstellt) --> " +
				c
		);
		return c;
	}
	//return "#A83F6A";
};

export const featureHoverer = (feature) => {
	return '<div>' + feature.text + '</div>';
};

const getSignatur = (properties) => {
	if (properties.typ === 'Verleihstation') {
		return 'pikto_e-bike_verleih.svg';
	} else {
		// return 'pikto_e-bike_verleih.svg';
		return 'pikto_e-bike_laden.svg';
	}
};

export const addSVGToFeature = (feature, manualReloadRequested) => {
	return new Promise(function(fulfilled, rejected) {
		let cacheHeaders = new Headers();
		if (manualReloadRequested) {
			cacheHeaders.append('pragma', 'no-cache');
			cacheHeaders.append('cache-control', 'no-cache');
		}

		fetch('/svgs/' + getSignatur(feature), { method: 'get', headers: cacheHeaders })
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					console.log('response', response);

					throw new Error("Server svg response wasn't OK");
				}
			})
			.then((svgText) => {
				const svgDocument = new DOMParser().parseFromString(svgText, 'application/xml');
				const svgObject = svgDocument.documentElement;
				if (svgObject.tagName === 'svg') {
					feature.svgBadge = svgText;
					feature.svgBadgeDimension = {
						width: svgObject.getAttribute('width'),
						height: svgObject.getAttribute('height')
					};
					fulfilled(feature);
				} else {
					throw new Error("Server svg response wasn't a SVG");
				}
			})
			.catch(function(error) {
				console.error('Problem bei /svgs/' + getSignatur(feature), error);
				console.error(error);

				//fallback SVG
				console.log('Will use fallbackSVG for ' + getSignatur(feature));

				feature.svgBadge = fallbackSVG;
				feature.svgBadgeDimension = {
					width: '311.668',
					height: '311.668'
				};
				fulfilled(feature);
			});
	});
};

export const getLinksForStation = (
	station,
	linkConfig = {
		zoomToFeature: undefined,
		showSecondaryInfo: undefined,
		phone: true,
		email: true,
		web: true
	}
) => {
	let links = [];
	let web, tel, email, primary, secondary, address, subject, contactSubject;
	if (station.typ === 'Verleihstation') {
		subject = 'Verleihstation';
		contactSubject = 'Verleihstation';
		web = station.homepage;
		tel = station.telefon;
		email = station.email;
	} else {
		// typ==='Ladestation'
		subject = 'Ladestation';
		contactSubject = 'Betreiber';
		web = station.betreiber.web;
		tel = station.betreiber.telefon;
		email = station.betreiber.email;
	}
	if (linkConfig.zoomToFeature !== undefined) {
		links.push(
			<IconLink
				key={`zoom`}
				tooltip={'Auf ' + subject + 'zoomen'}
				onClick={() => {
					linkConfig.zoomToFeature();
				}}
				iconname={'search-location'}
			/>
		);
	}
	if (linkConfig.showSecondaryInfo !== undefined) {
		links.push(
			<IconLink
				key={`IconLink.secondaryInfo`}
				tooltip='Datenblatt anzeigen'
				onClick={() => {
					linkConfig.showSecondaryInfo(true);
				}}
				iconname='info'
			/>
		);
	}
	if (tel && linkConfig.phone === true) {
		links.push(
			<IconLink
				key={`IconLink.tel`}
				tooltip={contactSubject + ' anrufen'}
				href={'tel:' + tel}
				iconname='phone'
			/>
		);
	}
	if (email && linkConfig.email === true) {
		links.push(
			<IconLink
				key={`IconLink.email`}
				tooltip={'E-Mail an ' + contactSubject + ' schreiben'}
				href={'mailto:' + email}
				iconname='envelope-square'
			/>
		);
	}
	if (web && linkConfig.web === true) {
		links.push(
			<IconLink
				key={`IconLink.web`}
				tooltip={contactSubject + 'webseite'}
				href={web}
				target='_blank'
				iconname='external-link-square'
			/>
		);
	}
	return links;
};

export const getSymbolSVG = (
	svgSize = 30,
	bg = '#FF0000',
	kind = '-',
	svgStyleRelatedId = 'default',
	svgCodeInput = verleihstationSVG
) => {
	let bdim = {
		width: 20,
		height: 20
	};

	let svgCode = `<svg  id="${svgStyleRelatedId}" height="${svgSize}" width="${svgSize}"> 
                    <style>
                    /* <![CDATA[ */
                        #${svgStyleRelatedId} .bg-fill  {
                            fill: ${bg};
                        }
                        #${svgStyleRelatedId} .bg-stroke  {
                            stroke: ${bg};
                        }
                        #${svgStyleRelatedId} .fg-fill  {
                            fill: white;
                        }
                        #${svgStyleRelatedId} .fg-stroke  {
                            stroke: white;
                        }
                    /* ]]> */
                    </style>
                <svg x="${svgSize / bdim.width / 2}" y="${svgSize /
		bdim.height /
		2}"  width="${svgSize - 2 * svgSize / bdim.width / 2}" height="${svgSize -
		2 * svgSize / bdim.height / 2}" viewBox="0 0 ${bdim.width} ${bdim.height || 24}">       
                    ${svgCodeInput}
                </svg>
                </svg>  `;

	return <SVGInline svg={svgCode} />;
};
