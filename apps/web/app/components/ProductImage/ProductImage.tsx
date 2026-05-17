import styles from './ProductImage.module.css';
import ModelViewer from './ModelViewer';

export default function ProductImage() {
  return (
    <div className={styles.container}>
      <ModelViewer />
    </div>
  );
}
