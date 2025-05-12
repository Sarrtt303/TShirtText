import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './index.css'; // Import your CSS file

type FormData = {
  height: number;
  weight: number;
  build: string;
  text: string;
};

const themes = [
  { primaryColor: 'blue', backgroundColor: 'lightblue' },
  { primaryColor: 'green', backgroundColor: 'lightgreen' },
  { primaryColor: 'red', backgroundColor: 'lightcoral' },
];

const App: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      height: 180,
      weight: 80,
      build: 'athletic',
      text: '',
    },
  });

  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [themeIndex, setThemeIndex] = useState(0);

  // Watch all form fields using the watch method from useForm
  const formData = watch();

  useEffect(() => {
    // Update ASCII art based on form data changes
    const generateAsciiArt = () => {
      // Implement your ASCII art generation logic here
      // For now, we'll just set a placeholder
      setAsciiArt(`T-shirt for:\nHeight: ${formData.height} cm\nWeight: ${formData.weight} kg\nBuild: ${formData.build}\nText: ${formData.text}`);
    };

    generateAsciiArt();
  }, [formData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'q') {
        setThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const theme = themes[themeIndex];

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission and ASCII conversion logic here
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageName('');
  };

  return (
    <div className="i2a" style={{ backgroundColor: theme.backgroundColor, color: theme.primaryColor }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="i2a__top">
          <div
            className="i2a__drop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="fileInput" />
            {image ? (
              <div>
                <img src={image} alt="Uploaded" style={{ width: '100%' }} />
                <p>{imageName}</p>
                <button type="button" onClick={handleRemoveImage}>Remove Image</button>
              </div>
            ) : (
              <label htmlFor="fileInput">
                <p>Drop an image here or click to upload</p>
              </label>
            )}
          </div>
          <div>
            <label className="i2a__label">
              Height (cm)
              <input
                className="i2a__input"
                type="number"
                {...register('height')}
              />
            </label>
            <label className="i2a__label">
              Weight (kg)
              <input
                className="i2a__input"
                type="number"
                {...register('weight')}
              />
            </label>
            <label className="i2a__label">
              Build
              <select className="i2a__input" {...register('build')}>
                <option value="lean">Lean</option>
                <option value="regular">Regular</option>
                <option value="athletic">Athletic</option>
                <option value="big">Big</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <label className="i2a__label">
            Text for T-Shirt
            <textarea
              className="i2a__textarea"
              {...register('text')}
              maxLength={100}
              rows={3}
            />
          </label>
        </div>
        <button className="i2a__button" type="submit">
          Generate T-shirt
        </button>
      </form>
      <div>
        <pre>{asciiArt}</pre>
      </div>
    </div>
  );
};

export default App;
