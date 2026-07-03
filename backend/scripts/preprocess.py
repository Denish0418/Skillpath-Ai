import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd
from pymongo import MongoClient
import json
import os

print("Downloading dataset from Kaggle...")
try:
    # Load dataset using KaggleDatasetAdapter as requested
    df = kagglehub.load_dataset(
        KaggleDatasetAdapter.PANDAS,
        "datasnaek/youtube-new",
        "USvideos.csv" # Specific file in the dataset
    )
    
    print(f"Dataset loaded! Total rows: {len(df)}")
    
    # Preprocess dataset: Extract relevant columns
    # Example structure of youtube-new: video_id, title, channel_title, category_id, tags, views, likes...
    
    # Filter for educational content (category_id 27 is Education in YouTube API)
    # Or just keep everything and search by title keywords
    educational_keywords = ["tutorial", "course", "learn", "how to", "react", "python", "javascript", "html", "css", "mongodb", "node", "express", "java", "c++", "ai", "machine learning"]
    
    # Create a regex pattern from keywords
    pattern = '|'.join(educational_keywords)
    
    print("Filtering for educational videos...")
    # Filter by category_id == 27 OR title containing keywords
    filtered_df = df[(df['category_id'] == 27) | (df['title'].str.contains(pattern, case=False, na=False))]
    
    print(f"Found {len(filtered_df)} educational/programming related videos.")
    
    # Map to our recommended video format
    videos = []
    for _, row in filtered_df.iterrows():
        videos.append({
            "title": row.get('title', 'Unknown Title'),
            "category": "Education",
            "channelName": row.get('channel_title', 'Unknown Channel'),
            "views": int(row.get('views', 0)),
            "url": f"https://www.youtube.com/watch?v={row.get('video_id', '')}",
            "tags": str(row.get('tags', ''))
        })
    
    # Output to JSON file so Node.js can use it
    output_path = os.path.join(os.path.dirname(__file__), "processed_videos.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(videos, f, indent=4)
        
    print(f"Successfully processed and saved {len(videos)} videos to {output_path}")

except Exception as e:
    print(f"Error processing dataset: {e}")
    print("Please ensure you have authenticated with Kaggle using `kaggle.json`.")
