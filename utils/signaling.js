// utils/signaling.js
import { supabase } from '../lib/supabase';

export const sendSDPToServer = async (offerOrAnswer, fromUser, toUser) => {
  const { data, error } = await supabase
    .from('calls')
    .insert([{ from_user: fromUser, to_user: toUser, sdp_offer: JSON.stringify(offerOrAnswer) }]);

  if (error) {
    console.error("Error sending SDP to server:", error);
  }
  return data;
};

export const listenForSDP = (peerConnection, userId) => {
  supabase
    .channel('calls')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'calls' }, async (payload) => {
      const call = payload.new;
      if (call.to_user === userId && call.sdp_offer) {
        const offer = JSON.parse(call.sdp_offer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendSDPToServer(answer, userId, call.from_user);
      }
    })
    .subscribe();
};

export const sendICECandidateToServer = async (candidate, fromUser, toUser) => {
  const { data, error } = await supabase
    .from('calls')
    .update({ ice_candidates: JSON.stringify(candidate) })
    .eq('from_user', fromUser)
    .eq('to_user', toUser);

  if (error) {
    console.error("Error sending ICE candidate to server:", error);
  }
  return data;
};

export const listenForICECandidates = (peerConnection, userId) => {
  supabase
    .channel('calls')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'calls' }, async (payload) => {
      const call = payload.new;
      if (call.to_user === userId && call.ice_candidates) {
        const candidates = JSON.parse(call.ice_candidates);
        candidates.forEach(candidate => {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        });
      }
    })
    .subscribe();
};
