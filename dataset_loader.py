# Install dependencies as needed:
# pip install kagglehub pandas
import kagglehub
import pandas as pd
import os
from pathlib import Path

# Note: The original KaggleDatasetAdapter.PANDAS approach doesn't work for this dataset 
# because it's an image classification dataset without a single CSV file to load.
# Instead, we'll create a DataFrame from the image file structure.

def load_dataset_with_structure():
    """
    Load the cloud image classification dataset and create a DataFrame
    similar to what KaggleDatasetAdapter.PANDAS would produce
    """
    # Download the dataset
    dataset_path = kagglehub.dataset_download("nakendraprasathk/cloud-image-classification-dataset")
    
    data = []
    for root, dirs, files in os.walk(dataset_path):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff')):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dataset_path)
                path_parts = Path(rel_path).parts
                
                # Extract information from path structure
                if 'train' in rel_path.lower():
                    split = 'train'
                    category = path_parts[-2] if len(path_parts) >= 3 else 'unknown'
                elif 'test' in rel_path.lower():
                    split = 'test'
                    category = 'unknown'
                else:
                    split = 'unknown'
                    category = 'unknown'
                
                data.append({
                    'filename': file,
                    'filepath': rel_path,
                    'full_path': full_path,
                    'category': category,
                    'split': split
                })
    
    return pd.DataFrame(data)

# This is the equivalent of your original code, but adapted for this image dataset
print("Loading cloud image classification dataset...")

# Since KaggleDatasetAdapter.PANDAS doesn't work for this image dataset,
# we use our custom function instead
df = load_dataset_with_structure()

# Add cloud type descriptions
cloud_types = {
    'Ac': 'Altocumulus', 'As': 'Altostratus', 'Cb': 'Cumulonimbus', 
    'Cc': 'Cirrocumulus', 'Ci': 'Cirrus', 'Cs': 'Cirrostratus',
    'Ct': 'Cumulonimbus', 'Cu': 'Cumulus', 'Ns': 'Nimbostratus',
    'Sc': 'Stratocumulus', 'St': 'Stratus'
}
df['cloud_type'] = df['category'].map(cloud_types).fillna('Unknown')

print("First 5 records:", df.head())

# Additional analysis you might want:
print(f"\nDataset contains {len(df)} images")
print(f"Training images: {len(df[df['split'] == 'train'])}")
print(f"Test images: {len(df[df['split'] == 'test'])}")

print("\nCloud type distribution in training data:")
train_data = df[df['split'] == 'train']
print(train_data['cloud_type'].value_counts())

# You can now work with the DataFrame as you would with any pandas DataFrame
# For example, to get all cumulus cloud images:
cumulus_images = df[df['category'] == 'Cu']
print(f"\nFound {len(cumulus_images)} cumulus cloud images")

# To access the actual image files, you can use the 'full_path' column:
if len(cumulus_images) > 0:
    print(f"Example cumulus image path: {cumulus_images.iloc[0]['full_path']}")