export const loadConfigUtility = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target?.result as string);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
