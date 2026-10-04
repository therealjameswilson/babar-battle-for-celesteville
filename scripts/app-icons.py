"""Original geometric crown badge; no external artwork or font dependencies."""
from PIL import Image, ImageDraw
from pathlib import Path
out=Path('dist/assets/app');out.mkdir(parents=True,exist_ok=True)
# Large vector-like shapes leave the outer 20% safe for rounded/maskable icons.
for size in (180,192,512):
    im=Image.new('RGB',(1024,1024),'#f4ecd4');d=ImageDraw.Draw(im)
    d.ellipse((160,160,864,864),fill='#28684c',outline='#24372f',width=16)
    d.polygon([(285,395),(393,466),(512,320),(631,466),(739,395),(681,650),(343,650)],fill='#e9bd4b',outline='#24372f',width=14)
    d.rounded_rectangle((339,630,685,701),radius=14,fill='#e9bd4b',outline='#24372f',width=12)
    for x,y in [(285,386),(512,315),(739,386)]:d.ellipse((x-20,y-20,x+20,y+20),fill='#e9bd4b',outline='#24372f',width=6)
    im.resize((size,size),Image.Resampling.LANCZOS).save(out/f'icon-{size}.png')
