// backend/scripts/resetVideos.ts

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';

const serviceAccount = {
  projectId: "video-sharing-platform-cc4e2",
  clientEmail: "firebase-adminsdk-vk5g0@video-sharing-platform-cc4e2.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCporfK2+Co+Nr8\nBbrmVZJFMehjU6ndfE+CbNh6lxXTma1aDZvhcUOG3U3MUib5rUWH5lL5lOJ7xmsG\nRNoM/cnhiuFtS7odIInrjHNspkln7RydrgQ4wrEUVA6mWGPLAAvQzS24vWCB3zwn\nZe4Ewn5fZ7JshsKMaYtbRiWmY5tHkx+XQvKhxv6xa9EpSPGkHjnFy8rwx9f7psho\nw52gcV1cLNyjiG79UZNRDaqv3aHamVqGhy+uPWGMrqmseDmq2h5SDm9RAvqyODs+\nddK1giaenCztSmclIR1l3+KQVDuUKUjXYCV1LPc5mJ/pPEe1qR+Sd8a+i8OB7Ltj\nTO6Q3kOjAgMBAAECggEAN9HtE8pNv5yABs1l5pSC+NUG6ORncZQN39esVo6v5nzb\nz9XJlSI9u7vH9XOVErTDPAh9BlbJPjyZDCuM6xh6HYcjTeFM4XfLGqERfE+tuQ6L\ny5EvH3Rla9CLL47Ha83clX1mzbM3dhT8yOQgMh3EEuXfDxo7G5RBgKvxCLMfLipA\n2V19/ij/DL16UHh/d2L/4HsRBrzmZtZHO/U5RoLVvXxyYQubbDIna1aH6z3i7Yk+\na2cFRNDRP08ecLUrShbMBtdQd9NQTWlvM4md179aepBJgN0APdYJ6KjV8Agv9aBC\nxbcXrwiIb4on1enL9HVkH+2oWMfsKTM5ySIPGnbzyQKBgQDV/I08Pcisa8vPUk49\nvSPL68JgEHmURv+zR2edG6wvI/3bPiJwWep0LbzO1/kYoenAXLTPcMId8bqGsqW0\nPgjT4ZIqA716sH4L8ekzb0x1HXZUStyOCHkpcPXf4juF3KnyhAku5CWDHv0qn2tZ\nRR4BB0/ZsnEQesuvirIW0jsUuQKBgQDK8P0ffjLJsgpzvaYzfDTlSkUiLoFtD46l\nR9zkfSXafCFCuimAW+LeF4jfw24EDLVfN5Ss5FYsSJh2GOwuE5n3KfyPk2swNuNN\nzSjrrq6zpe0oB9dla8KEVUXDxzg4k6+93PEbWkjHaxomoCam8E4Mhpytli6wwlI+\nueEMw+/lOwKBgFxJ7PvjRa4fW6pRvA7iiRLE3nMiB92MdXFzxVs7+Rnnsu+gr6e3\nD+gFZd3rxbH6+t6M3SpuXjod7C111QOUkagYLDrUnB7TCbnLHqGhSd9k0ojuNItJ\nWkAmSNTDNJq6Hc3LZk6D9S3E6rk8QkchCRy2c5jXXe4Wl8xgzAgNqY95AoGBALYX\njceYQJHhgqdfX6WKqRujjGyjNdZZwzBiTr1l3XUxM9bfmyVlTSbiDxpYDHrtvD/3\naxvGtdt+N+6fZivhwqCXt9pL+D2GwmWo1DLExlTDaQwmHQsPqbV7neGQ+80oFuRR\nPrXASNVGMGy//m6D6EQs9KB8xOAtPAa0Wk5N8Q7JAoGASKWOlyrwfJippBKO04oJ\noWfx1HUugU0pGvnljx8a58baoM79tDgqxf9w7siPCqXoIM8pbsYUWVfAaPrpoIjk\ngV6WoF67hTIaL39YLix2FiuryA/uLPc3l3Kvnarujvv/enDjOmkTXWDdICB5Nd+q\nXZvhA95O9BO49dvwbJjKReU=\n-----END PRIVATE KEY-----\n"
};

initializeApp({
  credential: cert(serviceAccount as any)
});

const db = getFirestore();

async function resetVideos() {
  try {
    // Delete videos except default
    const videosSnapshot = await db.collection('videos').get();
    const batch = db.batch();
    
    videosSnapshot.docs.forEach(doc => {
      if (!doc.id.startsWith('default_')) {
        batch.delete(doc.ref);
      }
    });

    // Delete all likes
    const likesSnapshot = await db.collection('likes').get();
    likesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete all dislikes
    const dislikesSnapshot = await db.collection('dislikes').get();
    dislikesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete all comments
    const commentsSnapshot = await db.collection('comments').get();
    commentsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Successfully reset all non-default videos and related data');
  } catch (error) {
    console.error('Error resetting videos:', error);
  }
  process.exit(0);
}

resetVideos();