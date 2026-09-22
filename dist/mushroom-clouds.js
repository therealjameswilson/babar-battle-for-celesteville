'use strict';
// Generated local artwork, inspected irregular crops. These are illustrative
// lower-/higher-yield profiles, not a way to identify weapon physics by shape.
const mushroomCloudSheet=new Image();mushroomCloudSheet.src='assets/mushroom-clouds.png';
const CLOUD_PROFILES={
  neutron:{crop:[16,440,620,530],width:150,duration:5,grow:1.5},
  atomic:{crop:[16,440,620,530],width:240,duration:8,grow:2.2},
  hydrogen:{crop:[640,64,880,910],width:390,duration:12,grow:3.5},
};
function mushroomCloudEffect(strike){
  const kind=strike.kind==='neutron'?'neutron':strike.kind==='hydrogen'?'hydrogen':'atomic',profile=CLOUD_PROFILES[kind];
  return {x:strike.x,y:strike.y,nuclearCloud:true,kind,life:profile.duration,max:profile.duration};
}
function mushroomCloudPose(f,minimizeMotion=false){
  const profile=CLOUD_PROFILES[f.kind]||CLOUD_PROFILES.atomic;
  const age=Math.max(0,f.max-f.life),progress=clamp(age/profile.grow,0,1);
  return {profile,age,growth:minimizeMotion?1:.28+.72*(1-Math.pow(1-progress,2)),
    opacity:Math.min(1,Math.max(0,f.life/2))*.85,
    dust:minimizeMotion?1:Math.min(1,age/1.4)};
}
function drawMushroomCloud(context,f,minimizeMotion=false){
  const {profile,age,growth,opacity,dust}=mushroomCloudPose(f,minimizeMotion);
  context.save();context.globalAlpha=opacity;
  // Ground dust stays anchored to the impact, below the rising stem and cap.
  context.save();context.translate(f.x,f.y+6);context.scale(1,.22);context.globalAlpha=opacity*.3;
  const radius=profile.width*(.2+.3*dust),haze=context.createRadialGradient(0,0,0,0,0,radius);
  haze.addColorStop(0,'#887964');haze.addColorStop(1,'#88796400');context.fillStyle=haze;
  context.beginPath();context.arc(0,0,radius,0,Math.PI*2);context.fill();context.restore();
  context.globalAlpha=opacity;
  const [sx,sy,sw,sh]=profile.crop,width=profile.width*(.65+.35*growth),height=profile.width*sh/sw*growth;
  if(mushroomCloudSheet.complete&&mushroomCloudSheet.naturalWidth){
    context.drawImage(mushroomCloudSheet,sx,sy,sw,sh,f.x-width/2,f.y-height+10,width,height);
  }else{
    // Recognizable low-cost silhouette while the local sheet loads.
    context.fillStyle=f.kind==='hydrogen'?'#b9b5a5':'#8d8070';
    context.fillRect(f.x-width*.07,f.y-height*.7,width*.14,height*.7);
    context.beginPath();context.ellipse(f.x,f.y-height*.73,width*.45,height*.27,0,0,Math.PI*2);context.fill();
  }
  // A brief muted glow, never a full-screen flash; omitted for reduced motion.
  if(!minimizeMotion&&age<.55){context.globalAlpha=.18*(1-age/.55);context.fillStyle='#d7a365';context.beginPath();context.ellipse(f.x,f.y,profile.width*.18,profile.width*.07,0,0,Math.PI*2);context.fill();}
  context.restore();
}
