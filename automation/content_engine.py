import os
import sys
import time
import json
import asyncio
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Load products database
from products_data import PRODUCTS

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def select_daily_product():
    """Rotate products based on day of year."""
    day_of_year = datetime.now().timetuple().tm_yday
    idx = day_of_year % len(PRODUCTS)
    return PRODUCTS[idx]

async def generate_voiceover(text, output_audio_path):
    """Generate high-end neural voiceover using Edge-TTS (Zero Cost, Studio Quality)."""
    import edge_tts
    # en-US-ChristopherNeural gives a deep, luxury automotive commercial tone
    voice = "en-US-ChristopherNeural"
    communicate = edge_tts.Communicate(text, voice, rate="+6%", pitch="-2Hz")
    await communicate.save(output_audio_path)
    print(f"[+] Audio voiceover generated: {output_audio_path}")

def create_video_frame(image_path, title, price, discount, frame_time, total_duration):
    """Render a luxury 1080x1920 vertical 9:16 frame with cinematic zoom & glowing HUD overlays."""
    width, height = 1080, 1920
    
    # 1. Base dark luxury canvas
    frame = Image.new("RGB", (width, height), color="#08090B")
    draw = ImageDraw.Draw(frame)

    # 2. Load and animate product image (Ken Burns zoom effect)
    if os.path.exists(image_path):
        prod_img = Image.open(image_path).convert("RGB")
        # Compute zoom scale from 1.0 to 1.15 over duration
        progress = frame_time / max(total_duration, 1.0)
        zoom = 1.0 + (progress * 0.12)
        
        # Crop center to aspect ratio
        pw, ph = prod_img.size
        target_aspect = 1080 / 1200
        new_w = int(pw * zoom)
        new_h = int(ph * zoom)
        prod_scaled = prod_img.resize((new_w, new_h), Image.Resampling.BILINEAR)
        
        # Center crop
        left = max(0, (new_w - 1080) // 2)
        top = max(0, (new_h - 1200) // 2)
        cropped = prod_scaled.crop((left, top, left + 1080, top + 1200))
        
        # Paste in center of canvas
        frame.paste(cropped, (0, 320))
    else:
        # Fallback background
        draw.rectangle([(0, 320), (1080, 1520)], fill="#141416")

    # 3. Top Branding Header
    font_path = "C:/Windows/Fonts/arialbd.ttf"
    if not os.path.exists(font_path):
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    
    try:
        brand_font = ImageFont.truetype(font_path, 48)
        title_font = ImageFont.truetype(font_path, 52)
        tag_font = ImageFont.truetype(font_path, 32)
        cta_font = ImageFont.truetype(font_path, 38)
    except Exception:
        brand_font = title_font = tag_font = cta_font = ImageFont.load_default()

    # Brand Title
    draw.text((width // 2, 140), "S O L V O", fill="#FFFFFF", anchor="mm", font=brand_font)
    draw.text((width // 2, 200), "PRECISION AUTOMOTIVE GEAR", fill="#DC2626", anchor="mm", font=tag_font)

    # 4. Top Badge (Discount & Status)
    draw.rounded_rectangle([(width // 2 - 180, 245), (width // 2 + 180, 305)], radius=12, fill="#DC2626")
    draw.text((width // 2, 275), f"🔥 {discount} LIMITED DROP", fill="#FFFFFF", anchor="mm", font=tag_font)

    # 5. Bottom Callout Card
    card_top = 1480
    draw.rectangle([(0, card_top), (width, height)], fill="#0A0B0E")
    draw.line([(0, card_top), (width, card_top)], fill="#DC2626", width=4)

    # Product Title
    draw.text((width // 2, card_top + 80), title, fill="#FFFFFF", anchor="mm", font=title_font)

    # Price Tag
    draw.text((width // 2, card_top + 160), f"Exclusive Price: {price}", fill="#4ADE80", anchor="mm", font=title_font)

    # High-Converting CTA Button with red glow
    cta_rect = [(width // 2 - 420, card_top + 230), (width // 2 + 420, card_top + 330)]
    draw.rounded_rectangle(cta_rect, radius=20, fill="#DC2626")
    draw.text((width // 2, card_top + 280), "TAP TO GET YOURS ➔ SOLVO.STORE", fill="#FFFFFF", anchor="mm", font=cta_font)

    return np.array(frame)

def render_video(product, audio_path, output_video_path):
    """Assemble video using MoviePy and synchronizing with voiceover audio."""
    from moviepy.editor import AudioFileClip, VideoClip

    audio_clip = AudioFileClip(audio_path)
    duration = audio_clip.duration + 0.5 # Add gentle outro pause

    img_path = os.path.join(os.path.dirname(__file__), "..", product["image_file"])

    def make_frame(t):
        return create_video_frame(
            img_path,
            product["title"],
            product["price"],
            product["discount"],
            t,
            duration
        )

    print(f"[*] Rendering vertical 9:16 video for {product['title']} ({duration:.1f}s)...")
    video = VideoClip(make_frame, duration=duration)
    video = video.set_audio(audio_clip)
    video.write_videofile(
        output_video_path,
        fps=24,
        codec="libx264",
        audio_codec="aac",
        threads=4,
        preset="fast",
        logger=None
    )
    print(f"[+] Video successfully generated: {output_video_path}")

def publish_youtube_shorts(video_path, product):
    """Publish generated short to YouTube if API keys are configured in environment."""
    refresh_token = os.getenv("YOUTUBE_REFRESH_TOKEN")
    client_secret_json = os.getenv("YOUTUBE_CLIENT_SECRET_JSON")

    if not refresh_token or not client_secret_json:
        print("[!] YouTube API keys not present in environment secrets. Saving video artifact for manual download.")
        return False

    try:
        from google.oauth2.credentials import Credentials
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload

        client_info = json.loads(client_secret_json)["installed"]
        creds = Credentials(
            None,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=client_info["client_id"],
            client_secret=client_info["client_secret"]
        )

        youtube = build("youtube", "v3", credentials=creds)

        title = f"{product['title']} - The Must-Have Car Upgrade! #Shorts"
        description = (
            f"Solve your biggest cabin frustration today with {product['title']}.\n\n"
            f"🔗 Order now at: https://solvo-store.vercel.app/\n\n"
            f"Tags: #{' #'.join(product['keywords'])} #shorts #caraccessories"
        )

        request_body = {
            "snippet": {
                "title": title[:100],
                "description": description,
                "tags": product["keywords"],
                "categoryId": "2" # Autos & Vehicles
            },
            "status": {
                "privacyStatus": "public",
                "selfDeclaredMadeForKids": False
            }
        }

        media = MediaFileUpload(video_path, mimetype="video/mp4", resumable=True)
        response = youtube.videos().insert(
            part="snippet,status",
            body=request_body,
            media_body=media
        ).execute()

        print(f"[+] Successfully published to YouTube Shorts! Video ID: {response.get('id')}")
        return True
    except Exception as e:
        print(f"[-] YouTube publish error: {e}")
        return False

def main():
    product = select_daily_product()
    print(f"=== SOLVO Content Engine: Selected '{product['title']}' ===")

    script_text = (
        f"{product['problem_hook']} "
        f"Meet the all-new {product['title']}. {product['solution']} "
        f"Order yours today with free express shipping at SOLVO dot STORE."
    )

    audio_path = os.path.join(OUTPUT_DIR, f"{product['id']}_voiceover.mp3")
    video_path = os.path.join(OUTPUT_DIR, f"{product['id']}_short.mp4")

    # 1. Voiceover
    asyncio.run(generate_voiceover(script_text, audio_path))

    # 2. Render Video
    render_video(product, audio_path, video_path)

    # 3. Publish to YouTube Shorts
    publish_youtube_shorts(video_path, product)

    # 4. Save metadata package for TikTok
    meta_path = os.path.join(OUTPUT_DIR, f"{product['id']}_tiktok_meta.json")
    tiktok_meta = {
        "title": f"Stop losing your items! 🏎️💨 {product['title']} #caraccessories #cargadgets #solvo",
        "product_url": "https://solvo-store.vercel.app/",
        "hashtags": product["keywords"],
        "generated_at": datetime.utcnow().isoformat()
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(tiktok_meta, f, indent=2)

    print(f"[+] All content automation steps finished successfully for {product['title']}!")

if __name__ == "__main__":
    main()
