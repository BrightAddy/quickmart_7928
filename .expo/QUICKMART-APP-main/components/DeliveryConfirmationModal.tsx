import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { X, Check, Camera, Upload, AlertCircle } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Button from './Button';
import Colors from '@/constants/colors';

interface DeliveryConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (photoUri?: string) => Promise<boolean>;
  title: string;
  description: string;
  requirePhoto?: boolean;
  isCustomer?: boolean;
}

export default function DeliveryConfirmationModal({ 
  visible, 
  onClose, 
  onConfirm,
  title,
  description,
  requirePhoto = false,
  isCustomer = false
}: DeliveryConfirmationModalProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  React.useEffect(() => {
    if (permission) {
      setHasPermission(permission.granted);
    }
  }, [permission]);

  const handleTakePhoto = () => {
    if (Platform.OS === 'web') {
      // For web, use a mock image
      setPhoto('https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1000&auto=format&fit=crop');
      setShowCamera(false);
      return;
    }
    
    // Request camera permission
    if (!permission?.granted) {
      requestPermission().then(result => {
        if (result.granted) {
          setShowCamera(true);
        } else {
          Alert.alert(
            "Camera Permission Required",
            "We need camera permission to take a delivery photo.",
            [{ text: "OK" }]
          );
        }
      });
    } else {
      setShowCamera(true);
    }
  };

  const capturePhoto = async () => {
    try {
      // In a real app, you would capture the photo here
      // For this demo, we'll use a sample image
      setPhoto('https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1000&auto=format&fit=crop');
      setShowCamera(false);
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo. Please try again.');
    }
  };

  const handleConfirm = async () => {
    if (requirePhoto && !photo && !isCustomer) {
      setError('Please take a photo of the delivery first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onConfirm(photo || undefined);
      
      if (success) {
        setPhoto(null);
        onClose();
      } else {
        setError('Failed to confirm delivery. Please try again.');
      }
    } catch (err) {
      console.error('Confirmation error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  if (showCamera) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCamera(false)}
      >
        <StatusBar style="light" />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Take Delivery Photo</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowCamera(false)}
            >
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cameraContainer}>
            {Platform.OS === 'web' ? (
              <View style={styles.webCameraPlaceholder}>
                <CameraView
                  style={styles.camera}
                  facing={cameraType}
                />
              </View>
            ) : (
              <CameraView
                style={styles.camera}
                facing={cameraType}
              />
            )}
            
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={capturePhoto}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.flipButton}
                onPress={() => setCameraType(current => current === 'back' ? 'front' : 'back')}
              >
                <Camera size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Check size={40} color={Colors.white} />
          </View>
          
          <Text style={styles.description}>{description}</Text>
          
          {!isCustomer && requirePhoto && (
            <View style={styles.photoSection}>
              <Text style={styles.photoTitle}>Delivery Photo</Text>
              <Text style={styles.photoDescription}>
                Take a photo of the delivered items at the customer's location
              </Text>
              
              {photo ? (
                <View style={styles.photoPreviewContainer}>
                  <Image 
                    source={{ uri: photo }} 
                    style={styles.photoPreview} 
                  />
                  <TouchableOpacity 
                    style={styles.retakeButton}
                    onPress={() => setPhoto(null)}
                  >
                    <Text style={styles.retakeButtonText}>Retake</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.photoButton}
                  onPress={handleTakePhoto}
                >
                  <Upload size={24} color={Colors.primary} />
                  <Text style={styles.photoButtonText}>Take Delivery Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <Button
            title={isCustomer ? "Confirm Delivery" : "Mark as Delivered"}
            onPress={handleConfirm}
            isLoading={isLoading}
            style={styles.confirmButton}
            icon={<Check size={20} color={Colors.white} />}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  photoSection: {
    width: '100%',
    marginBottom: 24,
  },
  photoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  photoDescription: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 16,
  },
  photoButton: {
    height: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  photoButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
  photoPreviewContainer: {
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retakeButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {
    width: '100%',
    marginTop: 'auto',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.error,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  webCameraPlaceholder: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.white,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});