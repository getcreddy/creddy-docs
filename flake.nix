{
  description = "Creddy docs development environment";

  inputs = {
    # Pin to nixpkgs with pre-built Node 22
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
          ];

          shellHook = ''
            echo "Creddy docs dev environment"
            echo "Node.js $(node --version)"
          '';
        };
      }
    );
}
