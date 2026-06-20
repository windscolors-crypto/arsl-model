/* Shell Voice offline service worker */
const CACHE='shellvoice-v7';
const ASSETS=["./", "home.html", "avatar.html", "class_names.json", "group1-shard1of1.bin", "group1-shard1of2.bin", "group1-shard2of2.bin", "index.html", "lib/fonts/cairo.css", "lib/fonts/cairo_1.woff2", "lib/fonts/cairo_2.woff2", "lib/fonts/cairo_3.woff2", "lib/hands.min.js", "lib/mediapipe/hand_landmark_full.tflite", "lib/mediapipe/hand_landmark_lite.tflite", "lib/mediapipe/hands.binarypb", "lib/mediapipe/hands.js", "lib/mediapipe/hands_solution_packed_assets.data", "lib/mediapipe/hands_solution_packed_assets_loader.js", "lib/mediapipe/hands_solution_simd_wasm_bin.js", "lib/mediapipe/hands_solution_simd_wasm_bin.wasm", "lib/mediapipe/hands_solution_wasm_bin.js", "lib/mediapipe/hands_solution_wasm_bin.wasm", "lib/tf-4.10.0.min.js", "lib/tf-4.22.0.min.js", "lib/three-examples/FBXLoader.js", "lib/three-examples/fflate.min.js", "lib/three.r128.min.js", "model.json", "sign_animations.json", "text2sign.html", "word_classes.json", "word_model.json", "words.html", "avatar_vrm.html", "learn.html", "libs/three.min.js", "libs/GLTFLoader.js", "sign_animations_holistic.json"];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(err=>{
    // add individually so one failure doesn't abort all
    return Promise.all(ASSETS.map(u=>c.add(u).catch(_=>console.warn('skip',u))));
  })));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'){return;}
  e.respondWith(
    caches.match(req,{ignoreSearch:true}).then(hit=>{
      if(hit) return hit;
      return fetch(req).then(res=>{
        // cache same-origin successful responses for next time
        try{
          const u=new URL(req.url);
          if(u.origin===location.origin && res.ok){
            const copy=res.clone();
            caches.open(CACHE).then(c=>c.put(req,copy));
          }
        }catch(_){}
        return res;
      }).catch(()=> caches.match('home.html'));
    })
  );
});
