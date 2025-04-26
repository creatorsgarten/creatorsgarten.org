import type { Requirement } from "$components/requirementsList.astro";

export function getEditRequirements(reason: string): Requirement[] {
  // Define each requirement with default met state
  const signedInRequirement: Requirement = {
    displayName: "Signed in to Creatorsgarten",
    met: true,
    callToAction: {
      text: "sign in",
      url: "/auth/login",
    },
  };
  
  const githubConnectedRequirement: Requirement = {
    displayName: "GitHub Account connected",
    met: true,
    callToAction: {
      text: "connect",
      url: "/auth/github",
    },
  };
  
  const creatorsTeamRequirement: Requirement = {
    displayName: "Joined the \"creators\" team in GitHub",
    met: true,
    callToAction: {
      text: "join",
      url: "/wiki/JoinCreatorsTeam",
    },
  };

  // Update requirements based on error message
  if (reason.includes("You're not logged in")) {
    signedInRequirement.met = false;
    githubConnectedRequirement.met = false;
    creatorsTeamRequirement.met = false;
  } 
  else if (reason.includes("Not authenticated")) {
    githubConnectedRequirement.met = false;
    creatorsTeamRequirement.met = false;
  } 
  else if (reason.includes("You should be in the \"creators\" team")) {
    creatorsTeamRequirement.met = false;
  }
  // Default case: all requirements remain met
  // Assemble and return all requirements
  return [
    signedInRequirement,
    githubConnectedRequirement,
    creatorsTeamRequirement
  ];
}